import fs from 'fs';
import path from 'path';

// 1ページあたりに表示する記事数
export const PAGE_SIZE = 15;

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
};

// ★生成されたMarkdownファイルを読み込む関数
export async function getPosts(): Promise<Post[]> {
  const postsDirectory = path.join(process.cwd(), 'content/posts');

  if (!fs.existsSync(postsDirectory)) return [];

  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames
    .filter(filename => filename.endsWith('.md'))
    .map(filename => {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');

      let title = '無題の記事';
      const titleMatch = fileContents.match(/title:\s*["']?([^"'\n]+)["']?/);
      if (titleMatch) {
        title = titleMatch[1];
      } else {
        const h1Match = fileContents.match(/^#\s+(.*)/m);
        if (h1Match) title = h1Match[1];
      }

      // ★ 追加：カテゴリーを抽出する
      let category = '未分類';
      const categoryMatch = fileContents.match(/category:\s*["']?([^"'\n]+)["']?/);
      if (categoryMatch) {
        category = categoryMatch[1];
      }

      let excerpt = '記事の詳細を読む...';
      const bodyLines = fileContents.replace(/---[\s\S]*?---/, '').replace(/^#.*$/m, '').split('\n');
      const firstLine = bodyLines.find(line => line.trim().length > 0 && !line.startsWith('<'));
      if (firstLine) {
        excerpt = firstLine.substring(0, 80) + '...';
      }

      return {
        slug: filename.replace('.md', ''),
        title,
        excerpt,
        category,
      };
    });

  return posts.sort((a, b) => (a.slug < b.slug ? 1 : -1));
}

// 総ページ数を計算する（1件も記事がなくても最低1ページ扱いにする）
export function getTotalPages(totalPosts: number): number {
  return Math.max(1, Math.ceil(totalPosts / PAGE_SIZE));
}

// 指定ページ分だけ記事を切り出す（pageは1始まり）
export function paginatePosts(posts: Post[], page: number): Post[] {
  const start = (page - 1) * PAGE_SIZE;
  return posts.slice(start, start + PAGE_SIZE);
}
