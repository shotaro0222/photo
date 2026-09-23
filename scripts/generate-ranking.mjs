import fs from 'fs';
import path from 'path';

const postsDirectory = path.resolve(process.cwd(), 'content/posts');
const dataDirectory = path.resolve(process.cwd(), 'src/data');

function generateRanking() {
  if (!fs.existsSync(postsDirectory)) {
    console.log('記事ディレクトリが存在しません。');
    return;
  }

  const files = fs.readdirSync(postsDirectory);
  const posts = [];

  files.forEach(file => {
    if (file.endsWith('.md')) {
      const filePath = path.join(postsDirectory, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      const titleMatch = content.match(/title:\s*"([^"]+)"/);
      // DBがないため、暫定的にファイルの更新日時や、フロントマターのpv設定を読み込む想定
      // ここではファイル名に含まれる日付文字列から最新のものを高く評価するか、ランダムPVを付与
      const stat = fs.statSync(filePath);
      
      if (titleMatch && titleMatch[1]) {
        posts.push({
          title: titleMatch[1],
          slug: file.replace(/\.md$/, ''),
          // 本格的にやる場合はGA4 APIから取得した値を入れるか、ここにviews: 123 などをパースする
          views: Math.floor(Math.random() * 1000) + 100, // 暫定のモックPV
          date: stat.mtime
        });
      }
    }
  });

  // viewsが多い順にソートしてトップ10を抽出
  const ranking = posts
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
  }

  fs.writeFileSync(
    path.join(dataDirectory, 'ranking.json'),
    JSON.stringify(ranking, null, 2)
  );
  
  console.log('✅ ranking.json を生成しました');
}

generateRanking();
