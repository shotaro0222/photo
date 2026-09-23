import fs from 'fs';
import path from 'path';

// リンク化の候補から除外する一般的すぎる単語（admin/page.tsxのキーワード分析と共通）
const STOP_WORDS = [
  'する', 'いる', 'ある', 'なる', 'こと', 'もの', 'これ', 'それ', 'ため', 'よう', 'です', 'ます',
  'ない', 'れる', 'られる', 'せる', 'させる', 'できる', 'ビジネス', '記事', '方法', '自分', '私たち',
  'という', 'など', 'その', 'この', 'あの', 'どの', 'から', 'まで', 'について', 'において'
];

// 正規表現の特殊文字をエスケープする
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// タイトルやカテゴリーの「全文」ではなく、本文中に実際に出現しそうな
// 短い単語（名詞など）をIntl.Segmenterで抽出する
function extractKeywords(text, maxKeywords) {
  if (!text) return [];

  const segmenter = new Intl.Segmenter('ja', { granularity: 'word' });
  const seen = new Set();
  const words = [];

  for (const { segment, isWordLike } of segmenter.segment(text)) {
    if (!isWordLike) continue;
    if (segment.length < 2) continue; // 1文字の単語はノイズになりやすいので除外
    if (STOP_WORDS.includes(segment)) continue;
    if (seen.has(segment)) continue;
    seen.add(segment);
    words.push(segment);
  }

  // 長い単語ほど固有名詞・専門用語である可能性が高いので優先的に残す
  return words.sort((a, b) => b.length - a.length).slice(0, maxKeywords);
}

// 過去の記事一覧からキーワードとURLのリストを生成する関数
export function buildKeywordMap(postsDirectory) {
  // キーワードが重複した場合は最初に見つかった記事を優先する
  const keywordMap = new Map();

  if (!fs.existsSync(postsDirectory)) return [];

  const files = fs.readdirSync(postsDirectory);

  files.forEach(file => {
    if (!file.endsWith('.md')) return;

    const filePath = path.join(postsDirectory, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // titleとcategoryを抽出
    const titleMatch = content.match(/title:\s*"([^"]+)"/);
    const categoryMatch = content.match(/category:\s*"([^"]+)"/);

    if (!titleMatch || !titleMatch[1]) return;

    // ファイル名からURLのスラッグを生成（拡張子を除去）
    const slug = file.replace(/\.md$/, '');
    const url = `/posts/${slug}`; // Next.jsのルーティングに合わせる

    // ★修正：タイトル・カテゴリー「全文」を登録するのをやめ、
    // 本文中に実際に出現しうる短いキーワードだけを抽出して登録する
    const keywords = [
      ...extractKeywords(titleMatch[1], 3),
      ...extractKeywords(categoryMatch?.[1], 2),
    ];

    keywords.forEach(keyword => {
      if (!keywordMap.has(keyword)) {
        keywordMap.set(keyword, url);
      }
    });
  });

  // キーワードが長い順にソート（短い単語が先に置換されて長い専門用語を分断するのを防ぐ）
  return Array.from(keywordMap.entries())
    .map(([keyword, url]) => ({ keyword, url }))
    .sort((a, b) => b.keyword.length - a.keyword.length);
}

// 本文内のキーワードを内部リンクに置換する関数
// ★修正：1記事あたりのリンク数に上限(maxLinks)を設け、貼りすぎを防止
export function injectInternalLinks(body, keywordMap, maxLinks = 4) {
  let newBody = body;
  let totalLinks = 0;

  for (const item of keywordMap) {
    if (totalLinks >= maxLinks) break;

    const safeKeyword = escapeRegExp(item.keyword);
    // すでにリンク化されている部分（<a href="...">の中身）は置換しないようにする
    // gフラグを付けず、1記事につき最初の1回だけ置換する
    const regex = new RegExp(`(?<!<[^>]*)(?<!<a[^>]*>)(${safeKeyword})(?![^<]*</a>)`);

    if (regex.test(newBody)) {
      newBody = newBody.replace(regex, (match) => `<a href="${item.url}" class="internal-link">${match}</a>`);
      totalLinks++;
    }
  }

  return newBody;
}
