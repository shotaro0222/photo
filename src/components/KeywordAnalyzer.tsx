'use client';

import React, { useEffect, useState } from 'react';
import { getKeywords } from './keywordAction';

export default function KeywordAnalyzer() {
  const [sortedWords, setSortedWords] = useState<{word: string, count: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 画面が表示されたタイミングで、サーバー側の解析処理（Action）を呼び出す
    getKeywords().then(words => {
      setSortedWords(words);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', marginTop: '20px' }}>
      <h2 style={{ fontSize: '20px', color: '#0f172a', marginBottom: '12px', fontWeight: 'bold' }}>
        📈 AI記事の頻出キーワード分析
      </h2>
      <p style={{ fontSize: '14px', color: '#475569', marginBottom: '20px', lineHeight: '1.6' }}>
        現在公開されている全記事を解析した「AIが使いがちな単語」のランキングです。<br/>
        この単語を <code>src/data/affiliates.json</code> のキーワードに登録すると、自然なアフィリエイトリンクの挿入率が最大化されます。
      </p>
      
      {loading ? (
        <p style={{ color: '#64748b' }}>⏳ 記事を解析しています...</p>
      ) : sortedWords.length === 0 ? (
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
