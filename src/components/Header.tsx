import Link from 'next/link';

export default function Header() {
  return (
    <header style={{ padding: '16px 20px', borderBottom: '1px solid #edf2f7', backgroundColor: '#fff', display: 'flex', alignItems: 'center' }}>
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* ヘッダー用の小型ロゴ (SVG) */}
        <svg width="24" height="24" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(0, 2)">
            <path d="M 12 12 L 15 6 L 25 6 L 28 12 Z" fill="#52796f" />
            <rect x="4" y="12" width="32" height="22" rx="4" fill="#52796f" />
            <circle cx="20" cy="23" r="8" fill="#ffffff" />
            <circle cx="20" cy="23" r="3" fill="#52796f" />
          </g>
        </svg>
        {/* ヘッダーのサイト名 */}
        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#2d3748' }}>Mindful Shutter</span>
      </Link>
    </header>
  );
}
