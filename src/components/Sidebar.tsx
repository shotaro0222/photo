// src/components/Sidebar.tsx
import Link from 'next/link';
import React from 'react';

export default function Sidebar() {
  return (
    <>
      {/* ▼ 追加：サイドバー専用のレスポンシブCSS ▼ */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .responsive-sidebar {
            width: 340px; /* PCでは以前(300px)より少し広くして目立たせる */
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            gap: 30px;
          }
          /* スマホ（画面幅768px以下）の場合は横幅100%に広げる */
          @media (max-width: 768px) {
            .responsive-sidebar {
              width: 100%;
            }
          }
        `
      }} />

      <aside className="responsive-sidebar">
        
        {/* ハブページへの誘導バナーエリア */}
        <div style={{ 
          backgroundColor: '#fff', 
          padding: '30px 24px', /* 余白も広げてタップしやすく */
          borderRadius: '12px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          border: '2px solid #ea580c', /* ★サイトに合わせて色を変更してください */
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '20px', color: '#111', margin: '0 0 16px 0', lineHeight: '1.4', fontWeight: 'bold' }}>
            あなたのビジネス、<br />“心・技・体” 整ってますか？
          </h3>
          <p style={{ fontSize: '14px', color: '#444', marginBottom: '20px', lineHeight: '1.6' }}>
            戦略・スキル・メンタルの3軸から持続可能性を判定する「総合評価レポート」を無料プレゼント中！
          </p>
          <Link href="/hub" style={{ 
            display: 'block',
            backgroundColor: '#ea580c', /* ★サイトに合わせて色を変更してください */
            color: '#fff', 
            textDecoration: 'none', 
            fontSize: '16px',
            fontWeight: 'bold',
            padding: '16px',
            borderRadius: '8px',
            transition: 'opacity 0.2s'
          }}>
            今すぐ無料診断する
          </Link>
        </div>

        {/* ABOUTエリア */}
        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '16px', color: '#333', marginBottom: '16px', borderBottom: '1px solid #eaeaea', paddingBottom: '8px', fontWeight: 'bold' }}>
            ABOUT
          </h3>
          <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', margin: 0 }}>
            個人が持続可能にビジネスを行い、自立し続けるためのヒントを発信しています。
          </p>
        </div>

      </aside>
    </>
  );
}
