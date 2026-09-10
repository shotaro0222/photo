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
  
// プロンプト部分を以下のように書き換えます
const prompt = `
あなたは写真とメンタルヘルスケアを組み合わせた新しいライフスタイルを提案するプロのライターです。
「写活✖︎メンタルヘルス✖︎ヘルスケア」や「マインドフルネスとしての写真」をテーマにしたブログ記事をMarkdown形式で作成してください。

【厳守事項 - 以下のルールを絶対に守ってください】
1. AIとしての返事や挨拶は一切含めず、記事のコンテンツ（Markdown）のみを出力してください。
2. 記事の先頭には必ず以下の形式でタイトルを記述してください。
---
title: "ここに魅力的で具体的な記事のタイトルを記載"
---
3. 本文では見出し（## や ###）を適切に使用して構造化してください。
4. 【重要】カメラの機種名、レンズのスペック、F値やシャッタースピードなどの「機材や技術的な解説」は極力避けてください。
5. 代わりに、外を歩くこと（散歩・ウォーキング）によるヘルスケア効果、ファインダーを覗くことでの「今ここ」への集中（マインドフルネス）、光や季節の変化に気づくことによるメンタルへの良い影響などに焦点を当ててください。
6. 以下の画像を、文脈に合わせて1〜2枚適切にMarkdown形式 (![alt](URL)) で挿入してください。
7. 画像や表などを1記事に複数必ず用いてリッチコンテンツにすること。
8. 記事の先頭には必ず以下の形式でタイトルとカテゴリー（1つ）を記述してください。
---
title: "ここに魅力的で具体的な記事のタイトルを記載"
category: "ここに記事のカテゴリーを記載（例：マーケティング、マインドセット、SEO、資金調達など）"
---

9.記事の最後には、必ず記事のテーマに直結する「読者向けの簡易診断システム（3問）」のデータを、以下のJSONフォーマットで出力してください。Markdownのコードブロック(```json)で囲むこと。

JSON
{
  "title": "（例：あなたの市場価値・準備度診断など）",
  "questions": [
    "（はい/いいえで答えられる質問1）",
    "（はい/いいえで答えられる質問2）",
    "（はい/いいえで答えられる質問3）"
  ],
  "resultHigh": "（はいが多かった人へのフィードバックやアドバイス）",
  "resultLow": "（いいえが多かった人へのフィードバックやアドバイス）"
}

【利用可能な画像URLリスト】
${availableImages.map(img => `- ${img.url} (内容: ${img.alt})`).join('\n')}
`;

  const result = await model.generateContent(prompt);
  let content = result.response.text();

  // ★ここでアフィリエイトリンクを自動挿入
  content = injectAffiliateLinks(content);

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
