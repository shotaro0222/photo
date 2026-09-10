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

// ★ 追加：Next.js推奨のモバイル最適化（ビューポート）設定
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
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

        {/* ★ 追加：レスポンシブ対応用のCSS */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* デフォルト（PC・タブレット横）のレイアウト */
            .layout-container {
              max-width: 1000px;
              margin: 40px auto;
              display: flex;
              gap: 40px;
              padding: 0 20px;
              align-items: flex-start;
            }
            .layout-main {
              flex: 1;
              background-color: #fff;
              padding: 30px;
              border-radius: 12px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.05);
              min-width: 0; /* Flexbox内で文字や画像がはみ出すのを防ぐ */
            }

            /* スマホ（画面幅768px以下）のレイアウト */
            @media (max-width: 768px) {
              .layout-container {
                flex-direction: column; /* 縦並びに変更 */
                margin: 20px auto;
                gap: 24px;
                padding: 0 15px;
              }
              .layout-main {
                width: 100%;
                padding: 20px 15px; /* スマホでは余白を少し狭くして読みやすく */
                box-sizing: border-box;
              }
            }
          `
        }} />
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

        {/* ★ 修正：インラインスタイルをやめ、クラス名でCSSを適用 */}
        <div className="layout-container">
          
          {/* 左側：メインコンテンツ（記事一覧や個別記事が入る場所） */}
          <main className="layout-main">
            {children}
          </main>

          {/* 右側：サイドバー（スマホでは自動的にメインコンテンツの下に配置されます） */}
          <Sidebar />
          
        </div>

        {/* フッター */}
        <footer style={{ textAlign: 'center', padding: '40px 0', color: '#718096', fontSize: '14px' }}>
          © {new Date().getFullYear()} Mindful Shutter. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
