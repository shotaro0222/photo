import fs from 'fs';
import path from 'path';
import AdminClient from './AdminClient';
import ImageUploader from '@/components/ImageUploader';

export const dynamic = 'force-static'; // 静的エクスポートを強制

export default function AdminPage() {
  let sortedWords: { word: string; count: number }[] = [];
  let articleFiles: string[] = [];

  try {
    // 複数のパス候補をチェックして、ビルド環境の差異によるエラーを防ぐ
    const possiblePaths = [
      path.join(process.cwd(), 'content/posts'),
      path.resolve(process.cwd(), 'content/posts'),
      path.join(process.env.RAILWAY_PROJECT_ROOT || process.cwd(), 'content/posts')
    ];

    let postsDirectory = '';
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        postsDirectory = p;
        break;
      }
    }

    if (postsDirectory && fs.existsSync(postsDirectory)) {
      const filenames = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md'));
      articleFiles = [...filenames].sort((a, b) => b.localeCompare(a));

      let allText = '';
      const targetFiles = articleFiles.slice(0, 5); // 最新の5記事に絞る
      
      targetFiles.forEach(filename => {
        const filePath = path.join(postsDirectory, filename);
        const content = fs.readFileSync(filePath, 'utf8');
        
        const excerpt = content.substring(0, 500); // 最初の500文字
        const cleanContent = excerpt
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
    console.error("キーワード解析エラー (ビルド継続):", error);
  }

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AdminClient keywords={sortedWords} files={articleFiles} />
          </div>
          <div className="lg:col-span-1">
            <ImageUploader />
          </div>
        </div>
      </div>
    </div>
  );
}
