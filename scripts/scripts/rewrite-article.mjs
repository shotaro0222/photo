import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { injectAffiliateLinks } from './injectAffiliates.mjs';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const targetFile = process.env.TARGET_FILE;
const instruction = process.env.INSTRUCTION;

if (!targetFile || !instruction) {
  console.error('ファイル名またはリライト指示が指定されていません。');
  process.exit(1);
}

const filePath = path.resolve(process.cwd(), 'content/posts', targetFile);
if (!fs.existsSync(filePath)) {
  console.error(`ファイルが見つかりません: ${filePath}`);
  process.exit(1);
}

async function rewriteArticle() {
  const originalContent = fs.readFileSync(filePath, 'utf8');

  // ★タイトル（Frontmatter）を切り離して完全保護
  let frontmatter = '';
  let body = originalContent;
  const match = originalContent.match(/^(---[\s\S]*?---[\r\n]+)([\s\S]*)$/);
  if (match) {
    frontmatter = match[1];
    body = match[2];
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  const prompt = `
あなたはプロの編集者・ブログライターです。
以下の「元記事」を、指定された「リライト指示」に従って書き直してください。

【リライト指示】
${instruction}

【厳守事項 - 必ず守ってください】
1. AIとしての返事や挨拶は一切含めず、書き直した記事の本文（Markdown）のみを出力してください。
2. 見出し（## や ###）などの文章構造は適切に維持・改善してください。
3. 元の記事に含まれている画像（![alt](URL)）や、末尾の簡易診断システム（\`\`\`json ... \`\`\`）は、極力消さずに文脈に合わせて残してください。
4. Markdownの装飾（太字など）を活用し、読みやすいリッチコンテンツにしてください。

【元記事の本文】
${body}
  `;

  console.log(`🚀 「${targetFile}」のリライトを開始します...`);
  const result = await model.generateContent(prompt);
  let newBody = result.response.text();

  // AI特有のマークダウン記号を除去
  newBody = newBody.replace(/^```(markdown)?\n/, '').replace(/\n```$/, '');

  // アフィリエイトリンクを再計算して挿入
  newBody = injectAffiliateLinks(newBody);

  // 保護しておいたタイトル部分と合体
  const finalContent = frontmatter + newBody;

  fs.writeFileSync(filePath, finalContent, 'utf8');
  console.log(`✅ リライト完了・保存しました！`);
}

rewriteArticle().catch(err => {
  console.error("❌ リライト中にエラーが発生しました:", err);
  process.exit(1);
});
