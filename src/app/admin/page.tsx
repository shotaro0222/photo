import fs from 'fs';
import path from 'path';
import AdminClient from './AdminClient';

export default function AdminPage() {
  const postsDirectory = path.join(process.cwd(), 'content/posts');
  let sortedWords: {word: string, count: number}[] = [];

  try {
    if (fs.existsSync(postsDirectory)) {
      const filenames = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md'));
      let allText = '';

      filenames.forEach(filename => {
        const filePath = path.join(postsDirectory, filename);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 解析の邪魔になる記号を削除
        const cleanContent = content
          .replace(/---[\s\S]*?---/g, '') 
          .replace(/```[\s\S]*?```/g, '') 
          .replace(/https?:\/\/[^\s]+/g, '') 
          .replace(/[#*`_\[\]()!<>\-]/g, ' '); 
          
        allText += cleanContent + ' ';
      });

      const segmenter = new Intl.Segmenter('ja', { granularity: 'word' });
      const segments = segmenter.segment(allText);
      const wordCount: Record<string, number> = {};
      
      const stopWords = [
        'する', 'いる', 'ある', 'なる', 'こと', 'もの', 'これ', 'それ', 'ため', 'よう', 'です', 'ます',
        'ない', 'れる', 'られる', 'せる', 'させる', 'できる', 'ビジネス', '記事', '方法', '自分', '私たち',
        'という', 'など', 'その', 'この', 'あの', 'どの', 'から', 'まで', 'について', 'において'
      ];

      for (const { segment, isWordLike } of segments) {
        if (isWordLike && segment.length >= 2) {
          if (!stopWords.includes(segment)) {
            wordCount[segment] = (wordCount[segment] || 0) + 1;
          }
        }
      }

      sortedWords = Object.entries(wordCount)
        .map(([word, count]) => ({ word, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 50);
    }
  } catch (error) {
    console.error("キーワード解析エラー:", error);
  }

  return <AdminClient keywords={sortedWords} />;
}
