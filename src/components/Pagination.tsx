import Link from 'next/link';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  accentColor?: string;
};

// ★追加：記事一覧のページ送りナビゲーション
// 1ページ目は「/」、2ページ目以降は「/page/2」「/page/3」...というURLにする
export default function Pagination({ currentPage, totalPages, accentColor = '#0070f3' }: PaginationProps) {
  if (totalPages <= 1) return null;

  const prevHref = currentPage <= 2 ? '/' : `/page/${currentPage - 1}`;
  const nextHref = `/page/${currentPage + 1}`;

  return (
    <nav
      aria-label="記事一覧のページ送り"
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '40px', flexWrap: 'wrap' }}
    >
      {currentPage > 1 ? (
        <Link
          href={prevHref}
          style={{ padding: '8px 18px', border: `1px solid ${accentColor}`, borderRadius: '6px', color: accentColor, textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}
        >
          ← 前のページ
        </Link>
      ) : (
        <span style={{ padding: '8px 18px', color: '#cbd5e1', fontSize: '14px' }}>← 前のページ</span>
      )}

      <span style={{ fontSize: '14px', color: '#64748b' }}>
        {currentPage} / {totalPages} ページ
      </span>

      {currentPage < totalPages ? (
        <Link
          href={nextHref}
          style={{ padding: '8px 18px', border: `1px solid ${accentColor}`, borderRadius: '6px', color: accentColor, textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}
        >
          次のページ →
        </Link>
      ) : (
        <span style={{ padding: '8px 18px', color: '#cbd5e1', fontSize: '14px' }}>次のページ →</span>
      )}
    </nav>
  );
}
