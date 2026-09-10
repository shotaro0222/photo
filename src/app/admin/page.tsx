'use client';

import { useState } from 'react';

export default function AdminDashboard() {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('');

  // アフィリエイト入力用の状態
  const [keyword, setKeyword] = useState('');
  const [adType, setAdType] = useState('text');
  const [adHtml, setAdHtml] = useState('');
  const [summary, setSummary] = useState('');

  const REPO_OWNER = 'shotaro0222'; 
  const REPO_NAME = 'photo';
  const WORKFLOW_ID = 'deploy.yml';

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

      // 現在のJSONファイルを取得
      const getRes = await fetch(apiUrl, {
        headers: { Authorization: `Bearer ${cleanToken}` }
      });
      
      let currentData = [];
      let sha = ''; // 上書きに必要なファイルのハッシュ値

      if (getRes.ok) {
        const fileData = await getRes.json();
        sha = fileData.sha;
        // Base64（日本語含む）をデコード
        const decodedContent = decodeURIComponent(escape(atob(fileData.content)));
        currentData = JSON.parse(decodedContent);
      }

      // 新しいアフィリエイト情報を追加
      const newAffiliate = {
        id: `ad-${Date.now()}`,
        keyword: keyword,
        type: adType,
        html: adHtml,
        summary: summary || '説明なし'
      };
      currentData.push(newAffiliate);

      // JSONをBase64にエンコードして保存
      const encodedContent = btoa(unescape(encodeURIComponent(JSON.stringify(currentData, null, 2))));

      const putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${cleanToken}`, Accept: 'application/vnd.github.v3+json' },
        body: JSON.stringify({
          message: `Add affiliate: ${keyword}`,
          content: encodedContent,
          sha: sha // 既存ファイルがある場合は必須
        })
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
      
      {/* 共通のトークン入力 */}
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

      {/* ★追加：アフィリエイト登録フォーム */}
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
