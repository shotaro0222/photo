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
    <div style={{ backgroundColor: '#faf9f7', minHeight: '100vh', padding: '0 0 40px 0' }}>
      {/* メインビジュアル＆トップメッセージ（背景色を少し温かみのあるオフホワイトに） */}
      <section style={{ marginBottom: '40px', padding: '40px 20px', borderBottom: '1px solid #e5e5e5', textAlign: 'center', backgroundColor: '#fff' }}>
        
        {/* トップページ用の中央ロゴ (SVG: カメラと葉っぱのモチーフ) */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <svg width="340" height="48" viewBox="0 0 340 48" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(0, 4)">
              {/* カメラのフラッシュ部分 */}
              <path d="M 12 12 L 15 6 L 25 6 L 28 12 Z" fill="#52796f" />
              {/* カメラのボディ */}
              <rect x="4" y="12" width="32" height="22" rx="4" fill="#52796f" />
              {/* レンズ */}
              <circle cx="20" cy="23" r="8" fill="#ffffff" />
              <circle cx="20" cy="23" r="3" fill="#52796f" />
              {/* 癒やし・自然を表す葉っぱのアクセント */}
              <path d="M 30 8 Q 36 0 40 6 Q 34 14 30 8 Z" fill="#84a98c" />
            </g>
            {/* サイトタイトル */}
            <text x="56" y="32" fontFamily="sans-serif" fontSize="26" fontWeight="bold" fill="#2d3748">Mindful Shutter</text>
          </svg>
        </div>

        <h1 style={{ fontSize: '22px', color: '#2d3748', marginBottom: '16px', lineHeight: '1.6', fontWeight: 'normal' }}>
          ファインダー越しの、<br />
          心ととのう時間。
        </h1>
        <p style={{ color: '#718096', lineHeight: '1.8', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
          機材のスペックよりも、心が何を感じたか。<br />
          カメラを持って歩く「写活」を通じて、メンタルヘルスを整え、<br />
          日常にマインドフルネスを取り入れるためのヒントをお届けします。
        </p>
      </section>

      {/* 記事一覧セクション */}
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: '18px', color: '#2d3748', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#52796f' }}></span>
          最新のジャーナル ({posts.length}件)
        </h2>
        
        {posts.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', background: '#fff', borderRadius: '12px', border: '1px solid #eaeaea' }}>
            <p style={{ color: '#a0aec0', margin: 0 }}>現在、公開されている記事はありません。</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {posts.map(post => (
              <article key={post.slug} style={{ padding: '24px', border: '1px solid #edf2f7', borderRadius: '12px', background: '#fff', transition: 'box-shadow 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>
                  <Link href={`/posts/${post.slug}`} style={{ color: '#52796f', textDecoration: 'none', fontWeight: 'bold' }}>
                    {post.title}
                  </Link>
                </h3>
                <p style={{ margin: 0, color: '#718096', fontSize: '14px', lineHeight: '1.7' }}>{post.excerpt}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
