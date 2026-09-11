'use client';

import { useState } from 'react';

export default function AdminClient({ keywords }: { keywords: {word: string, count: number}[] }) {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('');

  const [keyword, setKeyword] = useState('');
  const [adType, setAdType] = useState('text');
  const [adHtml, setAdHtml] = useState('');
  const [summary, setSummary] = useState('');

  const REPO_OWNER = 'shotaro0222'; 
  // ★対象サイトに合わせて変更（reskill.com / conconsalsal.com / photo）
  const REPO_NAME = 'photo'; 

  // 1. 記事生成トリガー
  const triggerGeneration = async (isBurst = false) => {
    setStatus('GitHub Actionsを起動中...');
    try {
      const cleanToken = token.trim();
      const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/workflows/deploy.yml/dispatches`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${cleanToken}`, Accept: 'application/vnd.github.v3+json' },
        body: JSON.stringify({ ref: 'main', inputs: { burst: isBurst ? 'true' : 'false' } }),
      });
      if (res.ok) setStatus(isBurst ? '🚀 50記事の生成プロセスを開始しました！' : '✅ 1記事の生成プロセスを開始しました！');
      else setStatus(`❌ エラー: ${res.status}`);
    } catch (error: any) { setStatus(`❌ 通信エラー: ${error.message}`); }
  };

  // ★2. 追加：既存記事へのアフィリエイト一括適用トリガー
  const triggerApplyAffiliates = async () => {
    setStatus('既存記事への一括適用を起動中...');
    try {
      const cleanToken = token.trim();
      const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/workflows/apply-affiliates.yml/dispatches`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${cleanToken}`, Accept: 'application/vnd.github.v3+json' },
        body: JSON.stringify({ ref: 'main' }),
      });
      if (res.ok) setStatus('✅ 既存の全記事へのアフィリエイト適用を開始しました！数分後に反映されます。');
      else setStatus(`❌ エラー: ${res.status}`);
    } catch (error: any) { setStatus(`❌ 通信エラー: ${error.message}`); }
  };

  // 3. アフィリエイトデータの登録
  const saveAffiliate = async () => {
    if (!keyword || !adHtml) return alert('キーワードと広告タグ（HTML）は必須です');
    setStatus('アフィリエイト辞書を更新中...');
    try {
      const cleanToken = token.trim();
      const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/src/data/affiliates.json`;
      const getRes = await fetch(apiUrl, { headers: { Authorization: `Bearer ${cleanToken}` } });
      let currentData = [], sha = ''; 
      if (getRes.ok) {
        const fileData = await getRes.json();
        sha = fileData.sha;
        currentData = JSON.parse(decodeURIComponent(escape(atob(fileData.content))));
      }
      currentData.push({ id: `ad-${Date.now()}`, keyword, type: adType, html: adHtml, summary: summary || '説明なし' });
      const putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${cleanToken}`, Accept: 'application/vnd.github.v3+json' },
        body: JSON.stringify({ message: `Add affiliate: ${keyword}`, content: btoa(unescape(encodeURIComponent(JSON.stringify(currentData, null, 2)))), sha })
      });
      if (putRes.ok) {
        setStatus(`✅ 「${keyword}」を登録しました！`);
        setKeyword(''); setAdHtml(''); setSummary('');
      } else setStatus(`❌ 登録エラー`);
    } catch (error: any) { setStatus(`❌ 保存通信エラー: ${error.message}`); }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>⚙️ サイト管理ダッシュボード</h1>
      
      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>🔑 GitHub合鍵（必須）</h3>
        <input type="password" placeholder="ghp_から始まるトークンを入力" value={token} onChange={(e) => setToken(e.target.value)} style={{ width: '100%', padding: '10px' }} />
      </div>

      {/* ＝＝＝＝3つのボタンが並ぶエリア＝＝＝＝ */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <button onClick={() => triggerGeneration(false)} style={{ padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>📝 今すぐ1記事生成</button>
        <button onClick={() => triggerGeneration(true)} style={{ padding: '10px 20px', background: '#ff4081', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>🔥 50記事一括生成</button>
        <button onClick={triggerApplyAffiliates} style={{ padding: '10px 20px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>🔄 既存の全記事にリンクを適用する</button>
      </div>
      {/* ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝ */}

      <div style={{ marginBottom: '40px' }}>
        <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <h2 style={{ fontSize: '20px', color: '#0f172a', marginBottom: '12px', fontWeight: 'bold' }}>📈 頻出キーワード分析</h2>
          <p style={{ fontSize: '14px', color: '#475569', marginBottom: '20px' }}>AIが使いがちな単語のランキングです。この単語を下のフォームで登録すると自然に挿入されます。</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {keywords.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>記事がまだないか、解析中です。</p>
            ) : (
              keywords.map((k, i) => (
                <div key={i} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', color: '#334155' }}>
                  <span style={{ fontWeight: 'bold', color: '#ea580c' }}>{i + 1}位: {k.word}</span> <span style={{ color: '#64748b' }}>({k.count}回)</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div style={{ background: '#e6f7ff', border: '1px solid #91d5ff', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>💰 アフィリエイト自動挿入の登録</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="text" placeholder="キーワード (例: サーバー, エックスサーバー)" value={keyword} onChange={e => setKeyword(e.target.value)} style={{ padding: '8px' }}/>
          <select value={adType} onChange={e => setAdType(e.target.value)} style={{ padding: '8px' }}>
            <option value="text">テキストリンク（キーワードをリンク化）</option>
            <option value="banner">バナー広告（該当段落の直下に配置）</option>
          </select>
          <textarea placeholder="広告タグ（HTML）を貼り付け" value={adHtml} onChange={e => setAdHtml(e.target.value)} rows={4} style={{ padding: '8px' }}/>
          <input type="text" placeholder="管理用のメモ（例: 秋キャンペーン）" value={summary} onChange={e => setSummary(e.target.value)} style={{ padding: '8px' }}/>
          <button onClick={saveAffiliate} style={{ padding: '10px', background: '#52c41a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>＋ この広告条件を登録する</button>
        </div>
      </div>

      {status && <div style={{ padding: '15px', background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '4px', fontWeight: 'bold' }}>{status}</div>}
    </div>
  );
}
