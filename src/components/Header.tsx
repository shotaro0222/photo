// src/components/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header style={{ 
      backgroundColor: '#fff', 
      borderBottom: '1px solid #eaeaea', 
      padding: '12px 20px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ 
        maxWidth: '1000px', 
        margin: '0 auto', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        
        {/* 左側：SoloCompassのロゴ（React用に属性を変換して埋め込み） */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <svg width="250" height="50" viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(10, 10) scale(0.25)">
              <circle cx="120" cy="120" r="100" fill="none" stroke="#e2e8f0" strokeWidth="12"/>
              <path d="M 120 30 L 160 140 L 120 125 Z" fill="#ea580c" />
              <path d="M 120 30 L 80 140 L 120 125 Z" fill="#0070f3" />
              <path d="M 80 140 L 160 140 L 120 190 Z" fill="#52796f" />
              <circle cx="120" cy="125" r="10" fill="#1e293b"/>
            </g>
            <text x="85" y="42" fontFamily="sans-serif" fontSize="24" fontWeight="bold" fill="#0f172a">SoloCompass</text>
            <text x="85" y="64" fontFamily="sans-serif" fontSize="12" fontWeight="normal" fill="#64748b">心・技・体で導く、個人のビジネス羅針盤</text>
          </svg>
        </Link>

        {/* 右側：ナビゲーションメニュー */}
        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link href="/" style={{ color: '#444', textDecoration: 'none', fontSize: '15px' }}>
            ホーム
          </Link>
          
          {/* ハブページへのリンク */}
          <Link href="/hub" style={{ 
            backgroundColor: '#ea580c', 
            color: '#fff', 
            textDecoration: 'none', 
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '8px 16px',
            borderRadius: '20px',
            transition: 'opacity 0.2s'
          }}>
            🎁 無料診断レポート
          </Link>
        </nav>
      </div>
    </header>
  );
}
