// src/components/Sidebar.tsx
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside style={{ 
      width: '300px', 
      flexShrink: 0, 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '30px' 
    }}>
      
      {/* ★追加：ハブページへの誘導バナーエリア */}
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '24px', 
        borderRadius: '12px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        border: '2px solid #ea580c', /* ←各サイトのテーマカラーに */
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '18px', color: '#111', margin: '0 0 12px 0', lineHeight: '1.4' }}>
          あなたのビジネス、<br />“心・技・体” 整ってますか？
        </h3>
        <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px', lineHeight: '1.5' }}>
          戦略・スキル・メンタルの3軸から持続可能性を判定する「総合評価レポート」を無料プレゼント中！
        </p>
        <Link href="/hub" style={{ 
          display: 'block',
          backgroundColor: '#ea580c', /* ←各サイトのテーマカラーに */
          color: '#fff', 
          textDecoration: 'none', 
          fontSize: '15px',
          fontWeight: 'bold',
          padding: '12px',
          borderRadius: '8px',
        }}>
          今すぐ無料診断する
        </Link>
      </div>

      {/* 以下、プロフィールやカテゴリーなどの既存のサイドバーコンテンツを配置 */}
      <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '16px', color: '#333', marginBottom: '16px', borderBottom: '1px solid #eaeaea', paddingBottom: '8px' }}>
          ABOUT
        </h3>
        <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
          個人が持続可能にビジネスを行い、自立し続けるためのヒントを発信しています。
        </p>
      </div>

    </aside>
  );
}
