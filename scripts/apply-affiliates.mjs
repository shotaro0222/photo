import fs from 'fs';
import path from 'path';
import { injectAffiliateLinks } from './injectAffiliates.mjs';

const postsDirectory = path.resolve(process.cwd(), 'content/posts');

if (!fs.existsSync(postsDirectory)) {
  console.log('記事フォルダが見つかりません。');
  process.exit(0);
}

const filenames = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md'));
let updatedCount = 0;

filenames.forEach(filename => {
  const filePath = path.join(postsDirectory, filename);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // アフィリエイトリンクを挿入
  const updatedContent = injectAffiliateLinks(content);
  
  // 中身に変化があった場合のみ、上書き保存する
  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    updatedCount++;
    console.log(`✅ 更新: ${filename}`);
  }
});

console.log(`🎉 完了: 合計 ${updatedCount} 件の記事にアフィリエイトリンクを適用しました！`);
