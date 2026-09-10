import Link from 'next/link';
import fs from 'fs';
import path from 'path';

// ★生成されたMarkdownファイルを読み込む関数
async function getPosts() {
  const postsDirectory = path.join(process.cwd(), 'content/posts');
  
  if (!fs.existsSync(postsDirectory)) return [];

  const filenames = fs.readdirSync(postsDirectory);
  
  const posts = filenames
    .filter(filename => filename.endsWith('.md'))
    .map(filename => {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      
      let title = '無題の記事';
      const titleMatch = fileContents.match(/title:\s*["']?([^"'\n]+)["']?/);
      if (titleMatch) {
        title = titleMatch[1];
      } else {
        const h1Match = fileContents.match(/^#\s+(.*)/m);
        if (h1Match) title = h1Match[1];
      }

      let excerpt = '記事の詳細を読む...';
      const bodyLines = fileContents.replace(/---[\s\S]*?---/, '').replace(/^#.*$/m, '').split('\n');
      const firstLine = bodyLines.find(line => line.trim().length > 0 && !line.startsWith('<'));
      if (firstLine) {
        excerpt = firstLine.substring(0, 80) + '...';
      }

      return {
        slug: filename.replace('.md', ''),
        title,
        excerpt,
      };
    });

  return posts.sort((a, b) => (a.slug < b.slug ? 1 : -1));
}

export default async function Home() {
  const posts = await getPosts(); 

  return (
    <div>
      {/* メインビジュアル＆トップメッセージ */}
      <section style={{ marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid #eaeaea', textAlign: 'center' }}>
        {/* トップページ用の中央ロゴ (SVG: 羅針盤モチーフ) */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <svg width="340" height="48" viewBox="0 0 340 48" xmlns="http://www.w3.org/2000/svg">
            {/* コンパス（羅針盤）のアイコン */}
            <circle cx="24" cy="24" r="20" fill="#0f766e" />
            <polygon points="24,8 32,24 24,40 16,24" fill="#ffffff" opacity="0.9" />
            <polygon points="24,8 32,24 24,24" fill="#ccfbf1" opacity="0.6" />
            <circle cx="24" cy="24" r="3" fill="#0f766e" />
            {/* サイトタイトル */}
            <text x="56" y="32" fontFamily="sans-serif" fontSize="26" fontWeight="bold" fill="#333">Freelance Compass</text>
          </svg>
        </div>

        <h1 style={{ fontSize: '24px', color: '#333', marginBottom: '16px', lineHeight: '1.4' }}>
          フリーランスの航海に、<br />
          確かな羅針盤を。
        </h1>
        <p style={{ color: '#666', lineHeight: '1.6', fontSize: '15px' }}>
          独立・起業のノウハウ、安定した案件獲得のコツ、税金や法務の基礎知識など、<br />
          個人で働く人のビジネスを加速させる実践的な情報を発信しています。
        </p>
      </section>

      {/* 記事一覧セクション */}
      <section>
        {/* 見出しのデザインも少し変更（左にティール色のライン） */}
        <h2 style={{ fontSize: '20px', color: '#333', marginBottom: '20px', borderLeft: '4px solid #0f766e', paddingLeft: '10px' }}>
          最新の記事 ({posts.length}件)
        </h2>
        
        {posts.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', background: '#f9f9f9', borderRadius: '8px' }}>
            <p style={{ color: '#999', margin: 0 }}>現在、公開されている記事はありません。</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {posts.map(post => (
              <article key={post.slug} style={{ padding: '20px', border: '1px solid #eaeaea', borderRadius: '8px', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>
                  {/* リンク色もテーマカラーに統一 */}
                  <Link href={`/posts/${post.slug}`} style={{ color: '#0f766e', textDecoration: 'none' }}>
                    {post.title}
                  </Link>
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '14px', lineHeight: '1.6' }}>{post.excerpt}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
