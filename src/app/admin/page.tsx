import fs from 'fs';
import path from 'path';
import AdminClient from './AdminClient';
// ★追加：作成した画像アップローダーをインポート
import ImageUploader from '@/components/ImageUploader';

export default function AdminPage() {
  const postsDirectory = path.join(process.cwd(), 'content/posts');
  let sortedWords: {word: string, count: number}[] = [];
  let articleFiles: string[] = []; // ★追加：記事ファイルの一覧

<<<<<<< HEAD
  try {
    if (fs.existsSync(postsDirectory)) {
      const filenames = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md'));
=======
export default function AdminDashboard() {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('');

  // アフィリエイト入力用の状態
  const [keyword, setKeyword] = useState('');
  const [adType, setAdType] = useState('text');
  const [adHtml, setAdHtml] = useState('');
  const [summary, setSummary] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageAlt, setImageAlt] = useState('');

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

  // 2. 画像アップロード（GitHubの public/uploads 配下に保存し、media.json に追加）
  const uploadImage = async () => {
    if (!selectedFile) {
      alert('アップロードする画像を選択してください');
      return;
    }

    if (!token.trim()) {
      alert('GitHub合鍵を入力してください');
      return;
    }

    setStatus('画像をアップロード中...');

    try {
      const cleanToken = token.trim();
      const safeName = selectedFile.name
        .trim()
        .replace(/[^a-zA-Z0-9._-]/g, '-')
        .replace(/-+/g, '-');
      const uniqueName = `${Date.now()}-${safeName}`;
      const filePath = `public/uploads/${uniqueName}`;
      const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`;

      const bytes = new Uint8Array(await selectedFile.arrayBuffer());
      let binary = '';
      bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
      });
      const base64Content = btoa(binary);

      const uploadRes = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Upload image: ${uniqueName}`,
          content: base64Content,
          branch: 'main'
        })
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json().catch(() => ({}));
        throw new Error(errorData.message || `アップロード失敗: ${uploadRes.status}`);
      }

      const mediaApiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/src/data/media.json`;
      const mediaRes = await fetch(mediaApiUrl, {
        headers: { Authorization: `Bearer ${cleanToken}` }
      });

      let currentData: Array<{ id: string; url: string; alt: string }> = [];
      let mediaSha = '';

      if (mediaRes.ok) {
        const mediaData = await mediaRes.json();
        mediaSha = mediaData.sha || '';
        const decodedContent = decodeURIComponent(escape(atob(mediaData.content)));
        currentData = JSON.parse(decodedContent || '[]');
      }

      const mediaEntry = {
        id: `media-${Date.now()}`,
        url: `/uploads/${uniqueName}`,
        alt: imageAlt || selectedFile.name.replace(/\.[^/.]+$/, '') || 'アップロード画像'
      };

      const updatedMedia = [...currentData, mediaEntry];
      const encodedContent = btoa(unescape(encodeURIComponent(JSON.stringify(updatedMedia, null, 2))));

      const mediaWriteRes = await fetch(mediaApiUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Update media list: ${uniqueName}`,
          content: encodedContent,
          sha: mediaSha
        })
      });

      if (!mediaWriteRes.ok) {
        const errorData = await mediaWriteRes.json().catch(() => ({}));
        throw new Error(errorData.message || `メディア一覧の更新に失敗しました`);
      }

      setStatus(`✅ 画像をアップロードしてメディア一覧に追加しました: ${mediaEntry.url}`);
      setSelectedFile(null);
      setImageAlt('');
      const input = document.getElementById('image-upload-input') as HTMLInputElement | null;
      if (input) input.value = '';
    } catch (error: any) {
      setStatus(`❌ 画像アップロード失敗: ${error.message}`);
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
>>>>>>> 399c87c (l)
      
      // ★追加：ファイル名を新しい順（降順）に並び替え
      articleFiles = [...filenames].sort((a, b) => b.localeCompare(a));

      let allText = '';
      filenames.forEach(filename => {
        const filePath = path.join(postsDirectory, filename);
        const content = fs.readFileSync(filePath, 'utf8');
        
        const cleanContent = content
          .replace(/---[\s\S]*?---/g, '') 
          .replace(/```[\s\S]*?```/g, '') 
          .replace(/https?:\/\/[^\s]+/g, '') 
          .replace(/[#*`_\[\]()!<>\-]/g, ' '); 
          
        allText += cleanContent + ' ';
      });

      const segmenter = new Intl.Segmenter('ja', { granularity: 'word' });
      const segments = segmenter.segment(allText);
      const wordCount: Record<string, number> = {};
      
      const stopWords = [
        'する', 'いる', 'ある', 'なる', 'こと', 'もの', 'これ', 'それ', 'ため', 'よう', 'です', 'ます',
        'ない', 'れる', 'られる', 'せる', 'させる', 'できる', 'ビジネス', '記事', '方法', '自分', '私たち',
        'という', 'など', 'その', 'この', 'あの', 'どの', 'から', 'まで', 'について', 'において'
      ];

      for (const { segment, isWordLike } of segments) {
        if (isWordLike && segment.length >= 2) {
          if (!stopWords.includes(segment)) {
            wordCount[segment] = (wordCount[segment] || 0) + 1;
          }
        }
      }

      sortedWords = Object.entries(wordCount)
        .map(([word, count]) => ({ word, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 50);
    }
  } catch (error) {
    console.error("キーワード解析エラー:", error);
  }

  // ★変更：AdminClientとImageUploaderを並べるグリッドレイアウトに変更
  return (
<<<<<<< HEAD
    <div className="p-4 md:p-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
=======
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

      <div style={{ background: '#fff7e6', border: '1px solid #ffd591', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>🖼️ 画像アップロード</h3>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
          画像を GitHub に保存して、記事生成時に使えるメディア一覧へ追加できます。
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            id="image-upload-input"
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
            style={{ padding: '8px' }}
          />
          <input
            type="text"
            placeholder="画像の説明文（alt）を入力"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            style={{ padding: '8px' }}
          />
          <button
            onClick={uploadImage}
            style={{ padding: '10px', background: '#fa8c16', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ⤴️ 画像をアップロードする
          </button>
        </div>
      </div>

      {/* ★追加：アフィリエイト登録フォーム */}
      <div style={{ background: '#e6f7ff', border: '1px solid #91d5ff', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>💰 アフィリエイト自動挿入の登録</h3>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
          ここで登録したキーワードが記事内に出現すると、自動的に広告が差し込まれます。（カンマ区切りで複数キーワード指定可能）
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="text" placeholder="キーワード (例: サーバー, エックスサーバー)" value={keyword} onChange={e => setKeyword(e.target.value)} style={{ padding: '8px' }}/>
>>>>>>> 399c87c (l)
          
          {/* 左側（メイン）：既存の記事一覧とキーワード解析 */}
          <div className="lg:col-span-2">
            <AdminClient keywords={sortedWords} files={articleFiles} />
          </div>
          
          {/* 右側（サイドバー）：画像アップローダー */}
          <div className="lg:col-span-1">
            <ImageUploader />
          </div>
          
        </div>
      </div>
    </div>
  );
}
