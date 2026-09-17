import fs from 'fs';
import path from 'path';
import AdminClient from './AdminClient';
// ★追加：作成した画像アップローダーをインポート
import ImageUploader from '@/components/ImageUploader';

export default function AdminPage() {
  const postsDirectory = path.join(process.cwd(), 'content/posts');
  let sortedWords: {word: string, count: number}[] = [];
  let articleFiles: string[] = []; // ★追加：記事ファイルの一覧

  try {
    if (fs.existsSync(postsDirectory)) {
      const filenames = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md'));
      
      // ★追加：ファイル名を新しい順（降順）に並び替え
      articleFiles = [...filenames].sort((a, b) => b.localeCompare(a));

      let allText = '';
      filenames.forEach(filename => {
        const filePath = path.join(postsDirectory, filename);
        const content = fs.readFileSync(filePath, 'utf8');
        
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

  // ★変更：AdminClientとImageUploaderを並べるグリッドレイアウトに変更
  return (
    <div className="p-4 md:p-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 左側（メイン）：既存の記事一覧とキーワード解析 */}
          <div className="lg:col-span-2">
            <AdminClient keywords={sortedWords} files={articleFiles} />
          </div>
          
          {/* 右側（サイドバー）：画像アップローダー */}
          <div className="lg:col-span-1">
            <ImageUploader />
          </div>
          
        </div>
      </div>
    </div>
  );
}
