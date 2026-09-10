import Link from 'next/link';
import fs from 'fs';
import path from 'path';
// ★追加：InteractiveTool コンポーネントをインポート
import InteractiveTool from '../components/InteractiveTool';

// ★追加：Mindful Shutter用のデフォルト診断データ
const defaultDiagnosisData = {
  "title": "個人事業主のための『メンタル・疲労度』チェック",
  "questions": [
    "休日に仕事の連絡が来ていないか、無意識にスマホやメールを確認しないようにしている。",
    "寝る直前まで、明日のタスクや売上の不安について考えることがない。",
    "この1週間で、意図的に「何もしない時間（余白）」を3時間以上作った。",
    "SNSで同業者の活躍や発信を見ても、過度な焦りや自己嫌悪に陥ることはない。",
    "仕事やビジネスとは全く関係のない「純粋な趣味」を、心から楽しむ余裕がある。"
  ],
  "resultHigh": "非常に良好なメンタルバランスを保てています！心に余白がある今こそ、新しいスキルの習得や仕組み作りに投資する絶好の機会です。<a href='https://reskill.bizpioneer.com' target='_blank' style='color:#2563eb; text-decoration:underline;'>Re:Skill Blog</a> を覗いてみませんか？",
  "resultLow": "身体と心が悲鳴を上げる一歩手前かもしれません。ビジネスを持続させるには「休むこと」も重要な戦略です。まずはファインダー越しの景色で心を整えましょう。働き方そのものを見直したい時は <a href='https://bizpioneer.com' target='_blank' style='color:#ea580c; text-decoration:underline;'>BizPioneer</a> がヒントになります。"
};

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

      // ★ 追加：カテゴリーを抽出する
      let category = '未分類';
      const categoryMatch = fileContents.match(/category:\s*["']?([^"'\n]+)["']?/);
      if (categoryMatch) {
        category = categoryMatch[1];
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
        category, // ★ 追加：カテゴリーを返す
      };
    });

  return posts.sort((a, b) => (a.slug < b.slug ? 1 : -1));
}

export default async function Home() {
  const posts = await getPosts(); 

  return (
    <div style={{ backgroundColor: '#faf9f7', minHeight: '100vh', padding: '0 0 40px 0' }}>
      {/* メインビジュアル＆トップメッセージ */}
      <section style={{ marginBottom: '40px', padding: '40px 20px', borderBottom: '1px solid #e5e5e5', textAlign: 'center', backgroundColor: '#fff' }}>
        
        {/* トップページ用の中央ロゴ (SVG) */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <svg width="340" height="48" viewBox="0 0 340 48" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(0, 4)">
              <path d="M 12 12 L 15 6 L 25 6 L 28 12 Z" fill="#52796f" />
              <rect x="4" y="12" width="32" height="22" rx="4" fill="#52796f" />
              <circle cx="20" cy="23" r="8" fill="#ffffff" />
              <circle cx="20" cy="23" r="3" fill="#52796f" />
              <path d="M 30 8 Q 36 0 40 6 Q 34 14 30 8 Z" fill="#84a98c" />
            </g>
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

      {/* ▼▼▼ 追加：デフォルト診断ツール配置エリア ▼▼▼ */}
      <section style={{ maxWidth: '800px', margin: '0 auto 40px auto', padding: '0 20px' }}>
        <InteractiveTool config={defaultDiagnosisData} />
      </section>
      {/* ▲▲▲ 追加ここまで ▲▲▲ */}

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
                
                {/* ★ 追加：カテゴリーバッジ */}
                <span style={{ display: 'inline-block', backgroundColor: '#eef2f1', color: '#52796f', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '16px', marginBottom: '12px' }}>
                  {post.category}
                </span>

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
