/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ← 既存の設定はそのまま残してください
  
  // ★追加：ビルドのタイムアウトをデフォルトの60秒から300秒（5分）に延長
  staticPageGenerationTimeout: 300, 
};

export default nextConfig;
