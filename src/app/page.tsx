import Link from 'next/link';
import fs from 'fs';
import path from 'path';

// ★生成されたMarkdownファイルを読み込む関数
async function getPosts() {
  const postsDirectory = path.join(process.cwd(), 'content/posts');
  
  // フォルダがまだない場合は空配列を返す
  if (!fs.existsSync(postsDirectory)) return [];

  const filenames = fs.readdirSync(postsDirectory);
  
  const posts = filenames
    .filter(filename => filename.endsWith('.md'))
    .map(filename => {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      
      // タイトルを自動抽出（フロントマターのtitle、または本文最初の見出し）
      let title = '無題の記事';
      const titleMatch = fileContents.match(/title:\s*["']?([^"'\n]+)["']?/);
      if (titleMatch) {
        title = titleMatch[1];
      } else {
        const h1Match = fileContents.match(/^#\s+(.*)/m);
        if (h1Match) title = h1Match[1];
      }

      // 記事の抜粋（要約）を抽出
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

  // ファイル名で降順ソート（最新の記事を一番上にする）
  return posts.sort((a, b) => (a.slug < b.slug ? 1 : -1));
}

export default async function Home() {
  // 記事データを取得
  const posts = await getPosts(); 

  return (
    <div>
      {/* メインビジュアル＆トップメッセージ */}
      <section style={{ marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid #eaeaea', textAlign: 'center' }}>
        {/* トップページ用の中央ロゴ */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <svg width="300" height="48" viewBox="0 0 250 40" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="8" fill="#0070f3" />
            <path d="M12 20h16M20 12v16" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            <text x="50" y="28" fontFamily="sans-serif" fontSize="24" fontWeight="bold" fill="#333">Re:Skill Blog</text>
          </svg>
        </div>

        <h1 style={{ fontSize: '24px', color: '#333', marginBottom: '16px', lineHeight: '1.4' }}>
          個人の価値を高める、<br />
          実践的リスキリング。
        </h1>
        <p style={{ color: '#666', lineHeight: '1.6', fontSize: '15px' }}>
          ITスキル、Webマーケティング、自動化ツールの活用など、個人がもっと自由に、効率的に働くための実践的なノウハウを発信しています。
        </p>
      </section>

      {/* 記事一覧セクション */}
      <section>
        <h2 style={{ fontSize: '20px', color: '#333', marginBottom: '20px' }}>最新の記事 ({posts.length}件)</h2>
        
        {posts.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', background: '#f9f9f9', borderRadius: '8px' }}>
            <p style={{ color: '#999', margin: 0 }}>現在、公開されている記事はありません。</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {posts.map(post => (
              <article key={post.slug} style={{ padding: '20px', border: '1px solid #eaeaea', borderRadius: '8px', background: '#fff' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>
                  <Link href={`/posts/${post.slug}`} style={{ color: '#0070f3', textDecoration: 'none' }}>
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