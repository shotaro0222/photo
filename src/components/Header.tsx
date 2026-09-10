// src/components/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header style={{ 
      backgroundColor: '#fff', 
      borderBottom: '1px solid #eaeaea', 
      padding: '16px 20px',
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
        {/* 左側：サイトタイトル（※各サイト名に合わせて変更してください） */}
        <Link href="/" style={{ fontSize: '20px', fontWeight: 'bold', color: '#111', textDecoration: 'none' }}>
          BizPioneer {/* ←Re:Skill BlogやMindful Shutterなど、サイト名に書き換えてください */}
        </Link>

        {/* 右側：ナビゲーションメニュー */}
        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link href="/" style={{ color: '#444', textDecoration: 'none', fontSize: '15px' }}>
            ホーム
          </Link>
          
          {/* ★追加：ハブページへのリンク（目立たせるためにボタン風に） */}
          <Link href="/hub" style={{ 
            backgroundColor: '#ea580c', /* ←各サイトのテーマカラーに合わせると綺麗です */
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
