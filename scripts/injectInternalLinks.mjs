import fs from 'fs';
import path from 'path';

// 過去の記事一覧からキーワードとURLのリストを生成する関数
export function buildKeywordMap(postsDirectory) {
  const keywordMap = [];
  
  if (!fs.existsSync(postsDirectory)) return keywordMap;

  const files = fs.readdirSync(postsDirectory);
  
  files.forEach(file => {
    if (file.endsWith('.md')) {
      const filePath = path.join(postsDirectory, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // titleとcategoryを抽出
      const titleMatch = content.match(/title:\s*"([^"]+)"/);
      const categoryMatch = content.match(/category:\s*"([^"]+)"/);
      
      if (titleMatch && titleMatch[1]) {
        const title = titleMatch[1];
        // ファイル名からURLのスラッグを生成（拡張子を除去）
        const slug = file.replace(/\.md$/, '');
        const url = `/posts/${slug}`; // Next.jsのルーティングに合わせる
        
        // タイトルそのものをキーワードとして登録
        keywordMap.push({ keyword: title, url: url });
        
        // カテゴリー名もキーワードとして登録（被り防止のため短い単語は要調整）
        if (categoryMatch && categoryMatch[1]) {
           keywordMap.push({ keyword: categoryMatch[1], url: url });
        }
      }
    }
  });

  // キーワードが長い順にソート（短い単語が先に置換されてしまうのを防ぐため）
  return keywordMap.sort((a, b) => b.keyword.length - a.keyword.length);
}

// 本文内のキーワードを内部リンクに置換する関数
export function injectInternalLinks(body, keywordMap) {
  let newBody = body;
  
  for (const item of keywordMap) {
    // すでにリンク化されている部分（<a href="...">や markdownの [text](url)）の中身は置換しないようにする正規表現
    // 簡易的に、タグの外側にあるキーワードだけを置換する
    const regex = new RegExp(`(?<!<[^>]*)(?<!<a[^>]*>)(${item.keyword})(?![^<]*</a>)`, 'g');
    
    // 1記事につき同じリンクが大量に発生するのを防ぐため、最初の1回だけ置換する
    // 必要に応じて 'g' フラグを外すか、カスタムのリプレース処理を行う
    let replacedCount = 0;
    newBody = newBody.replace(regex, (match) => {
      replacedCount++;
      if (replacedCount === 1) {
        return `<a href="${item.url}" class="internal-link">${match}</a>`;
      }
      return match;
    });
  }
  
  return newBody;
}
