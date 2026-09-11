import fs from 'fs';
import path from 'path';

const affiliatesPath = path.resolve(process.cwd(), 'src/data/affiliates.json');
let affiliates = [];
if (fs.existsSync(affiliatesPath)) {
  affiliates = JSON.parse(fs.readFileSync(affiliatesPath, 'utf8'));
  console.log(`💡 [システム] アフィリエイト辞書から ${affiliates.length} 件の広告データを読み込みました`);
} else {
  console.log(`⚠️ [システム] 辞書ファイル(affiliates.json)が見つかりません`);
}

export function injectAffiliateLinks(content, filename = 'ファイル') {
  let updatedContent = content;

  affiliates.forEach((aff) => {
    if (!aff.keyword || !aff.html) return;
    
    // 二重挿入チェック（※すでに挿入されている場合は、今回の処理はスキップして重複を防ぎます）
    if (updatedContent.includes(aff.html)) {
      console.log(`⏭️ [${filename}] 「${aff.keyword}」の広告はすでに挿入済みのためスキップしました`);
      return;
    }
    
    const keywords = aff.keyword.split(',').map((k) => k.trim()).filter(k => k !== '');
    
    // ★追加：この記事内でこの広告を挿入した回数をカウント
    let insertCount = 0;
    const MAX_INSERTS = 5; // ★ここを変更すれば最大件数を自由に変えられます（現在は最大5件）

    keywords.forEach((kw) => {
      // すでに最大件数に達していたら、このキーワードの処理を止める
      if (insertCount >= MAX_INSERTS) return; 

      const escapedKw = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      if (aff.type === 'text') {
        // ★変更：「g」フラグをつけて、記事内のすべての一致箇所を検索できるようにする
        const textRegex = new RegExp(`(^|[^<\\[])(${escapedKw})([^>\\]]|$)`, 'g');
        
        updatedContent = updatedContent.replace(textRegex, (match, p1, p2, p3) => {
          // もし上限に達していれば、広告には置き換えずに元の文字をそのまま返す
          if (insertCount >= MAX_INSERTS) {
            return match;
          }
          
          insertCount++;
          return p1 + aff.html + p3;
        });
        
        if (insertCount > 0) {
          console.log(`✅ [${filename}] テキスト広告「${kw}」を ${insertCount} 箇所に挿入しました！`);
        }
        
      } else {
        // バナー広告の場合
        const paragraphRegex = new RegExp(`^(.*${escapedKw}.*)$`, 'gm'); // gフラグで複数段落を検索
        
        updatedContent = updatedContent.replace(paragraphRegex, (match, p1) => {
          if (insertCount >= MAX_INSERTS) {
            return match;
          }
          
          insertCount++;
          return `${p1}\n\n<div class="affiliate-banner" style="margin: 32px 0; text-align: center;">\n${aff.html}\n</div>\n`;
        });

        if (insertCount > 0) {
          console.log(`✅ [${filename}] バナー広告「${kw}」を ${insertCount} 箇所に挿入しました！`);
        }
      }
    });
  });

  return updatedContent;
}
