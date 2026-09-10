import fs from 'fs';
import path from 'path';

// JSONデータの読み込み
const affiliatesPath = path.resolve(process.cwd(), 'src/data/affiliates.json');
const affiliates = JSON.parse(fs.readFileSync(affiliatesPath, 'utf8'));

/**
 * 記事の本文（Markdown/HTML）を受け取り、アフィリエイトリンクを自動挿入して返す
 */
export function injectAffiliateLinks(content) {
  let updatedContent = content;

  affiliates.forEach((aff) => {
    // カンマ区切りのキーワードを配列化して処理
    const keywords = aff.keyword.split(',').map((k) => k.trim());
    
    keywords.forEach((kw) => {
      // 既にHTMLタグの中にいるキーワード（リンク化済みなど）は避けるための正規表現
      const regex = new RegExp(`(?<!<[^>]*)${kw}(?![^<]*>)`, 'g');

      if (aff.type === 'text') {
        // テキストリンクの場合：キーワードそのものをリンク化、または直後に差し込み
        // 今回はシンプルにキーワードの直後にカッコ書き等で追加する例
        updatedContent = updatedContent.replace(
          regex,
          `${kw}（${aff.html}）`
        );
      } else if (aff.type === 'banner') {
        // バナーリンクの場合：該当キーワードを含む段落の直下にバナーを差し込む
        // 行末（\n）を利用して段落のブレイクポイントに挿入
        const paragraphRegex = new RegExp(`(.*${kw}.*)(\n|$)`, 'g');
        updatedContent = updatedContent.replace(
          paragraphRegex,
          `$1\n\n<div class="affiliate-banner" style="margin: 20px 0;">\n${aff.html}\n</div>\n\n`
        );
      }
    });
  });

  return updatedContent;
}

// ※この関数を、Geminiの記事生成スクリプト（generate-article.mjs）で
// ファイルを書き出す直前に呼び出すことで、完全自動化されます。