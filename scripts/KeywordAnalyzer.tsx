// src/components/KeywordAnalyzer.tsx
import React from 'react';
import fs from 'fs';
import path from 'path';

export default async function KeywordAnalyzer() {
  // サーバー側で全記事ファイルの読み込み・解析を実行
  const postsDirectory = path.join(process.cwd(), 'content/posts');
  let sortedWords: {word: string, count: number}[] = [];

  try {
    if (fs.existsSync(postsDirectory)) {
      const filenames = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md'));
      let allText = '';

      filenames.forEach(filename => {
        const filePath = path.join(postsDirectory, filename);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 解析の邪魔になるMarkdown記号やURLを削除
        const cleanContent = content
          .replace(/---[\s\S]*?---/g, '') 
          .replace(/```[\s\S]*?```/g, '') 
          .replace(/https?:\/\/[^\s]+/g, '') 
          .replace(/[#*`_\[\]()!<>\-]/g, ' '); 
          
        allText += cleanContent + ' ';
      });

      // Node.js標準機能で日本語の単語に分割
      const segmenter = new Intl.Segmenter('ja', { granularity: 'word' });
      const segments = segmenter.segment(allText);
      const wordCount: Record<string, number> = {};
      
      // アフィリエイトキーワードに向かない一般的な単語（ストップワード）
      const stopWords = [
        'する', 'いる', 'ある', 'なる', 'こと', 'もの', 'これ', 'それ', 'ため', 'よう', 'です', 'ます',
        'ない', 'れる', 'られる', 'せる', 'させる', 'できる', 'ビジネス', '記事', '方法', '自分', '私たち',
        'という', 'など', 'その', 'この', 'あの', 'どの', 'から', 'まで', 'について', 'において', 'について'
      ];

      for (const { segment, isWordLike } of segments) {
        // 2文字以上の意味のある単語のみをカウント
        if (isWordLike && segment.length >= 2) {
          if (!stopWords.includes(segment)) {
            wordCount[segment] = (wordCount[segment] || 0) + 1;
          }
        }
      }

      // 出現回数が多い順に50件ソート
      sortedWords = Object.entries(wordCount)
        .map(([word, count]) => ({ word, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 50);
    }
  } catch (error) {
    console.error("キーワード解析エラー:", error);
  }

  return (
    <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', marginTop: '20px' }}>
      <h2 style={{ fontSize: '20px', color: '#0f172a', marginBottom: '12px', fontWeight: 'bold' }}>
        📈 AI記事の頻出キーワード分析
      </h2>
      <p style={{ fontSize: '14px', color: '#475569', marginBottom: '20px', lineHeight: '1.6' }}>
        現在公開されている全記事を解析した「AIが使いがちな単語」のランキングです。<br/>
        この単語を <code>src/data/affiliates.json</code> のキーワードに登録すると、自然なアフィリエイトリンクの挿入率が最大化されます。
      </p>
      
      {sortedWords.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>記事がまだ公開されていないか、解析中です。</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {sortedWords.map((k, i) => (
            <div key={i} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', color: '#334155' }}>
              <span style={{ fontWeight: 'bold', color: '#ea580c' }}>{i + 1}位: {k.word}</span> 
              <span style={{ color: '#64748b', marginLeft: '6px' }}>({k.count}回)</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
