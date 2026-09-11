import fs from 'fs';
import path from 'path';

const affiliatesPath = path.resolve(process.cwd(), 'src/data/affiliates.json');
let affiliates = [];
if (fs.existsSync(affiliatesPath)) {
  affiliates = JSON.parse(fs.readFileSync(affiliatesPath, 'utf8'));
}

export function injectAffiliateLinks(content) {
  let updatedContent = content;

  affiliates.forEach((aff) => {
    if (!aff.keyword || !aff.html) return;
    
    // ★重要：すでにこの記事内に同じ広告が入っていれば、スキップする（二重挿入防止）
    if (updatedContent.includes(aff.html)) return;
    
    const keywords = aff.keyword.split(',').map((k) => k.trim()).filter(k => k !== '');
    let inserted = false; 

    keywords.forEach((kw) => {
      if (inserted) return; 

      const escapedKw = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      if (aff.type === 'text') {
        const textRegex = new RegExp(`(^|[^<\\[])(${escapedKw})([^>\\]]|$)`);
        if (textRegex.test(updatedContent)) {
          updatedContent = updatedContent.replace(textRegex, `$1${aff.html}$3`);
          inserted = true;
        }
      } else {
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
