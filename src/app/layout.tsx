// src/app/layout.tsx
import Script from 'next/script';
import settings from '../data/settings.json'; // パスは適宜合わせてください
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

// ★ ここにmetadataを追加して、ブラウザのタブに表示される名前を変更します
export const metadata = {
  title: 'Mindful Shutter',
  description: 'ファインダー越しの、心ととのう時間。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // settings.json から読み込むか、直接画像にあるIDを指定
  const GTM_ID = settings.gtmId || 'GTM-NCXMFQDT';

  return (
    <html lang="ja">
      <head>
        {/* ▼▼▼ 追加：Google AdSense のタグ ▼▼▼ */}
        <Script
          id="adsense-script"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8323476567735522"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* 1. <head> 用のGTMコード（Next.jsのScriptコンポーネントを使用） */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
      </head>

      <body style={{ margin: 0, padding: 0, backgroundColor: '#faf9f7', fontFamily: 'sans-serif' }}>
        
        {/* 2. <body> 直下のGTMコード（style属性をReact用に変換） */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        
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
            borderRadius: '12px', /* 少し丸みを強調 */
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            {children}
          </main>

          {/* 右側：サイドバー */}
          <Sidebar />
          
        </div>

        {/* フッター */}
        <footer style={{ textAlign: 'center', padding: '40px 0', color: '#718096', fontSize: '14px' }}>
          {/* ★ フッターのサイト名も変更しました */}
          © {new Date().getFullYear()} Mindful Shutter. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
