'use client';

import { useState } from 'react';

export default function AdminClient({ keywords }: { keywords: {word: string, count: number}[] }) {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('');

  // アフィリエイト入力用の状態
  const [keyword, setKeyword] = useState('');
  const [adType, setAdType] = useState('text');
  const [adHtml, setAdHtml] = useState('');
  const [summary, setSummary] = useState('');

  const REPO_OWNER = 'shotaro0222'; 
  const REPO_NAME = 'conconsalsal.com'; // ★他サイトの場合はここを変更してください

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

      if (res.ok) {
        setStatus(isBurst ? '🚀 50記事の生成プロセスを開始しました！' : '✅ 1記事の生成プロセスを開始しました！');
      } else {
        const errorData = await res.json().catch(() => ({}));
        setStatus(`❌ エラー: ${res.status} / ${errorData.message}`);
      }
    } catch (error: any) {
      setStatus(`❌ 通信エラー: ${error.message}`);
    }
  };

  // 2. アフィリエイトデータの登録（GitHubのJSONを更新）
  const saveAffiliate = async () => {
    if (!keyword || !adHtml) {
      alert('キーワードと広告タグ（HTML）は必須です');
      return;
    }
    setStatus('アフィリエイト辞書を更新中...');

    try {
      const cleanToken = token.trim();
      const filePath = 'src/data/affiliates.json';
      const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`;

      const getRes = await fetch(apiUrl, { headers: { Authorization: `Bearer ${cleanToken}` } });
      let currentData = [];
      let sha = ''; 

      if (getRes.ok) {
        const fileData = await getRes.json();
        sha = fileData.sha;
        const decodedContent = decodeURIComponent(escape(atob(fileData.content)));
        currentData = JSON.parse(decodedContent);
      }

      currentData.push({
        id: `ad-${Date.now()}`,
        keyword: keyword,
        type: adType,
        html: adHtml,
        summary: summary || '説明なし'
      });

      const encodedContent = btoa(unescape(encodeURIComponent(JSON.stringify(currentData, null, 2))));
      const putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${cleanToken}`, Accept: 'application/vnd.github.v3+json' },
        body: JSON.stringify({ message: `Add affiliate: ${keyword}`, content: encodedContent, sha: sha })
      });

      if (putRes.ok) {
        setStatus(`✅ アフィリエイト「${keyword}」を登録しました！次の記事生成時から自動挿入されます。`);
        setKeyword(''); setAdHtml(''); setSummary('');
      } else {
        const err = await putRes.json();
        setStatus(`❌ 登録エラー: ${err.message}`);
      }
    } catch (error: any) {
      setStatus(`❌ 保存通信エラー: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>⚙️ サイト管理ダッシュボード</h1>
      
      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>🔑 GitHub合鍵（必須）</h3>
        <input 
          type="password" 
          placeholder="ghp_から始まるトークンを入力" 
          value={token} 
          onChange={(e) => setToken(e.target.value)}
          style={{ width: '100%', padding: '10px' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
        <button onClick={() => triggerGeneration(false)} style={{ padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>📝 今すぐ1記事生成する</button>
        <button onClick={() => triggerGeneration(true)} style={{ padding: '10px 20px', background: '#ff4081', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>🔥 初回50記事を一括生成</button>
      </div>

      {/* キーワード解析の表示エリア */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <h2 style={{ fontSize: '20px', color: '#0f172a', marginBottom: '12px', fontWeight: 'bold' }}>
            📈 AI記事の頻出キーワード分析
          </h2>
          <p style={{ fontSize: '14px', color: '#475569', marginBottom: '20px', lineHeight: '1.6' }}>
            現在公開されている全記事を解析した「AIが使いがちな単語」のランキングです。<br/>
            この単語を下のフォームで登録すると、自然なアフィリエイトリンクの挿入率が最大化されます。
          </p>
          
          {keywords.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>記事がまだないか、解析中です。</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {keywords.map((k, i) => (
                <div key={i} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', color: '#334155' }}>
                  <span style={{ fontWeight: 'bold', color: '#ea580c' }}>{i + 1}位: {k.word}</span> 
                  <span style={{ color: '#64748b', marginLeft: '6px' }}>({k.count}回)</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* アフィリエイト登録フォーム */}
      <div style={{ background: '#e6f7ff', border: '1px solid #91d5ff', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>💰 アフィリエイト自動挿入の登録</h3>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
          ここで登録したキーワードが記事内に出現すると、自動的に広告が差し込まれます。（カンマ区切りで複数キーワード指定可能）
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="text" placeholder="キーワード (例: サーバー, エックスサーバー)" value={keyword} onChange={e => setKeyword(e.target.value)} style={{ padding: '8px' }}/>
          <select value={adType} onChange={e => setAdType(e.target.value)} style={{ padding: '8px' }}>
            <option value="text">テキストリンク（キーワードをリンク化、または直後に配置）</option>
            <option value="banner">バナー広告（該当段落の直下に大きく配置）</option>
          </select>
          <textarea placeholder="A8.net等の広告タグ（HTML）を貼り付け" value={adHtml} onChange={e => setAdHtml(e.target.value)} rows={4} style={{ padding: '8px' }}/>
          <input type="text" placeholder="管理用のメモ（例: Xserverの秋キャンペーン）" value={summary} onChange={e => setSummary(e.target.value)} style={{ padding: '8px' }}/>
          <button onClick={saveAffiliate} style={{ padding: '10px', background: '#52c41a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            ＋ この広告条件を登録する
          </button>
        </div>
      </div>

      {status && <div style={{ padding: '15px', background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '4px', fontWeight: 'bold' }}>{status}</div>}
    </div>
  );
}
