import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { injectAffiliateLinks } from './injectAffiliates.mjs';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// GitHub Actionsから渡された環境変数を見て、50回か1回かを決定
const runCount = process.env.IS_BURST === 'true' ? 50 : 1;

// 画像リストの読み込み（Xserverにアップ済みの画像のパスリスト）
const mediaPath = path.resolve(process.cwd(), 'src/data/media.json');
let availableImages = [];
if (fs.existsSync(mediaPath)) {
  availableImages = JSON.parse(fs.readFileSync(mediaPath, 'utf8'));
}

async function generateSingleArticle(index) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  // ★ プロンプト修正：表（テーブル）の厳格な出力ルールを追加し、エラー原因の記号を修正
const prompt = `
あなたは写真とメンタルヘルスケアを組み合わせた新しいライフスタイルを提案するプロのライターです。
「写活✖︎メンタルヘルス✖︎ヘルスケア」や「マインドフルネスとしての写真」「ビジネス✖︎写活」をテーマにしたブログ記事をMarkdown形式で作成してください。

【厳守事項 - 以下のルールを絶対に守ってください】
1. AIとしての返事や挨拶は一切含めず、記事のコンテンツ（Markdown）のみを出力してください。
2. 記事の先頭には必ず以下の形式でタイトルとカテゴリー（1つ）を記述してください。これがないとシステムがエラーになります。
---
title: "ここに魅力的で具体的な記事のタイトルを記載"
category: "ここに記事のカテゴリーを記載（例：メンタルケア、写活、マインドフルネス、ヘルスケアなど）"
---
※【超重要】titleの中身は「純粋なプレーンテキスト」のみとし、HTMLタグ（<a>など）やMarkdown記号は絶対に含めないでください。

3. 本文では見出し（## や ###）を適切に使用して構造化してください。
4. 【重要】カメラの機種名、レンズのスペック、F値やシャッタースピードなどの「機材や技術的な解説」は極力避けてください。
5. 代わりに、外を歩くこと（散歩・ウォーキング）によるヘルスケア効果、ファインダーを覗くことでの「今ここ」への集中（マインドフルネス）、光や季節の変化に気づくことによるメンタルへの良い影響などに焦点を当ててください。
6. 以下の画像を、文脈に合わせて1〜2枚適切にMarkdown形式 (![alt](URL)) で挿入してください。
7. 【レイアウトと表（テーブル）に関する厳格なルール】
記事内で複数の項目とその解説を列挙する場面（例：症状と解説、メリットと詳細、原因と対策など）では、箇条書き（*）を絶対に使用せず、必ずMarkdownの「表（テーブル）」を作成して視覚的に見やすく整理してください。
（悪い例：「* 項目: 説明 * 項目: 説明」のように1行に連続して詰め込むことは固く禁じます）
8. 記事の最後には、必ず記事のテーマに直結する「読者向けの簡易診断システム（3問）」のデータを、以下のJSONフォーマットで出力してください。Markdownのコードブロック(\`\`\`json)で囲むこと。

\`\`\`json
{
  "title": "（例：現在のメンタル疲労度・リラックス度チェックなど）",
  "questions": [
    "（はい/いいえで答えられる質問1）",
    "（はい/いいえで答えられる質問2）",
    "（はい/いいえで答えられる質問3）"
  ],
  "resultHigh": "（はいが多かった人へのフィードバック）。心が整っている今こそ、新しいITスキルや自動化を学ぶチャンスです。<a href='https://あなたのリスキルブログのURL' target='_blank'>Re:Skill Blog</a> を覗いてみませんか？",
  "resultLow": "（いいえが多かった人へのフィードバック）。焦らず自分のペースを取り戻しましょう。自分らしい働き方のヒントや偉人の言葉は <a href='https://あなたのBizPioneerのURL' target='_blank'>BizPioneer</a> で見つかるかもしれません。"
}
\`\`\`

【利用可能な画像URLリスト】
${availableImages.map(img => `- ${img.url} (内容: ${img.alt})`).join('\n')}
`;

  const result = await model.generateContent(prompt);
  let content = result.response.text();

  // ★修正：AIが記事全体を ```markdown で囲ってきた場合のみ、外側のラッパーを除去する
  // これにより、末尾のJSONブロックの ``` が誤って消されることを完全に防ぎます。
  content = content.trim();
  const outerWrapperMatch = content.match(/^```(?:markdown|md)?\s*\n([\s\S]*)\n```$/);
  if (outerWrapperMatch) {
    content = outerWrapperMatch[1].trim();
  }

  // ★【修正箇所】タイトル部分（Frontmatter）を切り離して、広告挿入から保護する
  let frontmatter = '';
  let body = content;

  const match = content.match(/^(---[\s\S]*?---[\r\n]+)([\s\S]*)$/);
  if (match) {
    frontmatter = match[1]; // タイトルとカテゴリーの部分
    body = match[2];        // 記事の本文
  }

  // ★本文（body）にだけアフィリエイトリンクを自動挿入
  body = injectAffiliateLinks(body);

  // 切り離していたタイトル部分を安全にくっつける
  content = frontmatter + body;

  // ファイル名の生成と保存
  const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `post-${dateStr}-${index}.md`;
  const dirPath = path.resolve(process.cwd(), 'content/posts');
  
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  fs.writeFileSync(path.join(dirPath, filename), content);
  console.log(`✅ 記事生成完了: ${filename}`);
  
  // API制限回避のための待機時間（15秒）
  await new Promise(resolve => setTimeout(resolve, 15000));
}

async function main() {
  console.log(`🚀 生成開始: ${runCount}記事を生成します...`);
  for (let i = 1; i <= runCount; i++) {
    console.log(`⏳ ${i}/${runCount} 記事目を生成中...`);
    try {
      await generateSingleArticle(i);
    } catch (error) {
      console.error(`❌ エラー発生（${i}回目）:`, error);
      // エラーが起きたらループを抜けて、そこまでの記事を保存させる
      console.log(`⚠️ API制限などのため、${i - 1}記事目までを保存して終了します。`);
      break; 
    }
  }
  console.log('🎉 すべての生成プロセスが完了しました！');
}

main();
