/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true, // ★この1行を追加します
  // （もし他の設定が既に書かれていれば、それはそのまま残してください）
};

export default nextConfig; // 環境によっては module.exports = nextConfig; になっています