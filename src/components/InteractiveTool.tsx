'use client';

import { useState } from 'react';

export default function InteractiveTool({ configStr }: { configStr: string }) {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);

  // AIが生成した診断データを読み込む
  let config = null;
  try {
    config = JSON.parse(configStr);
  } catch (e) {
    return null; // データがない・壊れている場合は表示しない
  }

  if (!config || !config.questions) return null;

  const handleAnswer = (points: number) => {
    setScore(score + points);
    setStep(step + 1);
  };

  const isFinished = step >= config.questions.length;

  return (
    <div style={{ margin: '40px 0', padding: '30px', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '12px' }}>
      <h3 style={{ marginTop: 0, textAlign: 'center', fontSize: '20px', color: '#1e293b' }}>
        📊 {config.title || '簡単チェックツール'}
      </h3>
      
      {!isFinished ? (
        <div>
          <p style={{ textAlign: 'center', fontWeight: 'bold', margin: '20px 0' }}>
            Q{step + 1}. {config.questions[step]}
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={() => handleAnswer(10)} style={{ padding: '10px 30px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>はい</button>
            <button onClick={() => handleAnswer(0)} style={{ padding: '10px 30px', background: '#94a3b8', color: '#fff', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>いいえ</button>
          </div>
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', marginTop: '15px' }}>
            質問 {step + 1} / {config.questions.length}
          </p>
        </div>
      ) : (
        <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
          <h4 style={{ fontSize: '18px', color: '#0070f3' }}>診断完了！</h4>
         <p 
            style={{ fontSize: '16px', lineHeight: '1.6', fontWeight: 'bold' }}
            dangerouslySetInnerHTML={{ __html: score >= (config.questions.length * 10) / 2 ? config.resultHigh : config.resultLow }}
          />
          <button onClick={() => { setStep(0); setScore(0); }} style={{ marginTop: '20px', padding: '8px 20px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: '4px', cursor: 'pointer' }}>
            もう一度やり直す
          </button>
        </div>
      )}
    </div>
  );
}
