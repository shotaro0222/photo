// src/app/layout.tsx
import Script from 'next/script';
import settings from '../data/settings.json'; // パスは適宜合わせてください
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const GTM_ID = settings.gtmId;

  return (
    <html lang="ja">
      {/* ... (GTMのhead部分は省略、そのまま残してください) ... */}
      <body style={{ margin: 0, padding: 0, backgroundColor: '#fafafa', fontFamily: 'sans-serif' }}>
        {/* ... (GTMのnoscript部分もそのまま) ... */}
        
        {/* ヘッダー */}
        <Header />

        {/* 2カラムのメインレイアウト */}
        <div style={{ 
          maxWidth: '1000px', 
          margin: '40px auto', 
          display: 'flex', 
          gap: '40px',
          padding: '0 20px',
          alignItems: 'flex-start' 
        }}>
          
          {/* 左側：メインコンテンツ（記事一覧や個別記事が入る場所） */}
          <main style={{ 
            flex: 1, 
            backgroundColor: '#fff', 
            padding: '30px', 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            {children}
          </main>

          {/* 右側：サイドバー */}
          <Sidebar />
          
        </div>

        {/* フッター */}
        <footer style={{ textAlign: 'center', padding: '40px 0', color: '#999', fontSize: '14px' }}>
          © {new Date().getFullYear()} Re:Skill Blog. All rights reserved.
        </footer>
      </body>
    </html>
  );
}