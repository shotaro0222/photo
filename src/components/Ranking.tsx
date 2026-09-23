import fs from 'fs';
import path from 'path';
import Link from 'next/link';

// ランキングデータを型定義 (TypeScriptの場合)
type RankingItem = {
  title: string;
  slug: string;
  views: number;
};

export default function Ranking() {
  // 静的JSONを読み込む
  const rankingFilePath = path.join(process.cwd(), 'src/data/ranking.json');
  let rankingPosts: RankingItem[] = [];

  try {
    if (fs.existsSync(rankingFilePath)) {
      const fileContents = fs.readFileSync(rankingFilePath, 'utf8');
      rankingPosts = JSON.parse(fileContents);
    }
  } catch (error) {
    console.error('ランキングデータの読み込みに失敗しました', error);
  }

  if (rankingPosts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-bold mb-4 border-b pb-2">人気記事ランキング</h3>
      <ul className="space-y-3 flex flex-col">
        {rankingPosts.map((post, index) => (
          <li key={post.slug} className="flex items-start gap-3">
            <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
              index < 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              {index + 1}
            </span>
            <Link 
              href={`/posts/${post.slug}`}
              className="text-gray-800 hover:text-blue-600 hover:underline line-clamp-2 text-sm leading-tight"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
