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
  // ==========================================
  // 【1】 破壊を防ぐための「保護」プロセス
  // ==========================================
  
  // ① タイトル・カテゴリー（Frontmatter）の保護
  let frontmatter = '';
  let body = content;
  const fmMatch = content.match(/^(---[\s\S]*?---[\r\n]+)([\s\S]*)$/);
  if (fmMatch) {
    frontmatter = fmMatch[1];
    body = fmMatch[2];
  }

  // ② JSONなどのコードブロック（```で囲まれた部分）の保護
  // コードブロックを一旦抜き出し、仮の目印（プレースホルダー）に置き換えます
  const codeBlocks = [];
  body = body.replace(/```[\s\S]*?```/g, (match) => {
    codeBlocks.push(match);
    return `___CODE_BLOCK_${codeBlocks.length - 1}___`;
  });

  // ==========================================
  // 【2】 アフィリエイト広告の挿入プロセス
  // ==========================================
  
  let updatedContent = body;

  affiliates.forEach((aff) => {
    if (!aff.keyword || !aff.html) return;
    
    // 二重挿入チェック（すでに挿入されている場合はスキップ）
    if (updatedContent.includes(aff.html)) {
      console.log(`⏭️ [${filename}] 「${aff.keyword}」の広告はすでに挿入済みのためスキップしました`);
      return;
    }
    
    const keywords = aff.keyword.split(',').map((k) => k.trim()).filter(k => k !== '');
    
    let insertCount = 0;
    const MAX_INSERTS = 5; // ★最大挿入件数

    keywords.forEach((kw) => {
      // すでに最大件数に達していたらスキップ
      if (insertCount >= MAX_INSERTS) return; 

      const escapedKw = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      if (aff.type === 'text') {
        // テキスト広告の挿入
        const textRegex = new RegExp(`(^|[^<\\[])(${escapedKw})([^>\\]]|$)`, 'g');
        
        updatedContent = updatedContent.replace(textRegex, (match, p1, p2, p3) => {
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
        // バナー広告の挿入
        const paragraphRegex = new RegExp(`^(.*${escapedKw}.*)$`, 'gm');
        
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

  // ==========================================
  // 【3】 保護していた要素の「復元」プロセス
  // ==========================================
  
  // 目印（プレースホルダー）を、元のJSONやコードブロックに戻す
  codeBlocks.forEach((block, idx) => {
    updatedContent = updatedContent.replace(`___CODE_BLOCK_${idx}___`, block);
  });

  // 最後にタイトル（Frontmatter）をくっつけて返す
  return frontmatter + updatedContent;
}
