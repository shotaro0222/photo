import fs from 'fs';
import path from 'path';

// JSONデータの読み込み
const affiliatesPath = path.resolve(process.cwd(), 'src/data/affiliates.json');
let affiliates = [];
if (fs.existsSync(affiliatesPath)) {
  affiliates = JSON.parse(fs.readFileSync(affiliatesPath, 'utf8'));
}

/**
 * 記事の本文（Markdown/HTML）を受け取り、アフィリエイトリンクを自動挿入して返す
 */
export function injectAffiliateLinks(content) {
  let updatedContent = content;

  affiliates.forEach((aff) => {
    // データが空の場合はスキップ
    if (!aff.keyword || !aff.html) return;
    
    // カンマ区切りのキーワードを配列化して前後の空白を除去
    const keywords = aff.keyword.split(',').map((k) => k.trim()).filter(k => k !== '');
    
    let inserted = false; // ★ 1つの広告につき1回だけ挿入するためのフラグ

    keywords.forEach((kw) => {
      if (inserted) return; // 既にこの広告が挿入済みなら、他の類義語では挿入しない

      // 正規表現エラーを防ぐため、キーワード内の記号をエスケープ
      const escapedKw = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      if (aff.type === 'text') {
        // テキストリンクの場合：
        // Markdownのリンク [テキスト](URL) や HTMLタグ <a href="..."> の中に「ない」単語を探す
        // gフラグを外しているため、記事中で「最初に見つかった安全な1箇所」だけを置換します
        const textRegex = new RegExp(`(^|[^<\\[])(${escapedKw})([^>\\]]|$)`);
        
        if (textRegex.test(updatedContent)) {
          // 見つけたキーワードをアフィリエイトHTMLに置き換える
          updatedContent = updatedContent.replace(
            textRegex,
            `$1${aff.html}$3`
          );
          inserted = true;
        }

      } else {
        // バナー（banner）リンクの場合：
        // キーワードが含まれる「段落（行）」を見つけ、その段落の「直下」にバナーを挿入する
        // mフラグにより、行単位で安全にマッチさせます
        const paragraphRegex = new RegExp(`^(.*${escapedKw}.*)$`, 'm');
        
        if (paragraphRegex.test(updatedContent)) {
          updatedContent = updatedContent.replace(
            paragraphRegex,
            `$1\n\n<div class="affiliate-banner" style="margin: 32px 0; text-align: center;">\n${aff.html}\n</div>\n`
          );
          inserted = true;
        }
      }
    });
  });

  return updatedContent;
}
