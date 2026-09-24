import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPosts, getTotalPages, paginatePosts } from '@/lib/posts';
import Pagination from '@/components/Pagination';

// 静的エクスポート対象にする
export const dynamic = 'force-static';

// ★追加：記事一覧のページネーション用ルート（/page/2, /page/3, ...）
// 1ページ目はトップページ（/）が担当するので、ここでは2ページ目以降だけ生成する
export async function generateStaticParams() {
  const posts = await getPosts();
  const totalPages = getTotalPages(posts.length);

  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    page: String(i + 2),
  }));
}

export default async function PostsPage({ params }: { params: { page: string } }) {
  const pageNumber = Number(params.page);
  const posts = await getPosts();
  const totalPages = getTotalPages(posts.length);

  if (!Number.isInteger(pageNumber) || pageNumber < 2 || pageNumber > totalPages) {
    notFound();
  }

  const pagePosts = paginatePosts(posts, pageNumber);

  return (
    <div style={{ backgroundColor: '#faf9f7', minHeight: '100vh', padding: '0 0 40px 0' }}>
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '20px 20px 0 20px' }}>
        <Link href="/" style={{ color: '#52796f', textDecoration: 'none', fontSize: '14px' }}>
          ← トップへ戻る
        </Link>
      </section>

      <section style={{ maxWidth: '800px', margin: '20px auto 0 auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: '18px', color: '#2d3748', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#52796f' }}></span>
          記事一覧（{pageNumber}ページ目） ({posts.length}件)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {pagePosts.map(post => (
            <article key={post.slug} style={{ padding: '24px', border: '1px solid #edf2f7', borderRadius: '12px', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
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

        <Pagination currentPage={pageNumber} totalPages={totalPages} accentColor="#52796f" />
      </section>
    </div>
  );
}
