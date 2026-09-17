'use client';

import { useState } from 'react';

export default function MediaManagementPage() {
  const [file, setFile] = useState(null);
  const [altText, setAltText] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('画像を選択してください');

    setIsLoading(true);
    setStatus('アップロード中...');
    
    const formData = new FormData();
    formData.append('image', file);
    formData.append('alt', altText);

    try {
      // ※注意: ご自身のXserverのドメイン（アップロード先）に変更してください
      const res = await fetch('https://your-xserver-domain.com/upload-api.php', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();

      if (data.success) {
        setStatus(`✅ 成功: ${data.message}`);
        setFile(null);
        setAltText('');
        // 連続アップロードできるようにファイル選択をリセット
        document.getElementById('file-upload-input').value = '';
      } else {
        setStatus(`❌ エラー: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ 通信エラーが発生しました。サーバー側の設定を確認してください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">画像・メディア管理</h1>
        
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-6">新規画像のアップロード</h2>
          <p className="text-sm text-gray-500 mb-6">
            アップロードした画像はXserverに保存され、AIが記事を自動生成する際の素材（media.json）として即座に追加されます。
          </p>

          <form onSubmit={handleUpload} className="space-y-6">
            {/* ファイル選択 */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                画像ファイル (JPEG, PNG, WebP)
              </label>
              <input 
                id="file-upload-input"
                type="file" 
                accept="image/png, image/jpeg, image/webp"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
              />
            </div>

            {/* 代替テキスト(alt)入力 */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                画像の説明（AIに内容を伝えるためのテキスト）
              </label>
              <input 
                type="text" 
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="例: ノートパソコンを開いてカフェで仕事をする女性"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <p className="text-xs text-gray-500 mt-2">
                ※AIはこの説明文を読んで、記事の文脈に合う画像を自動選択します。
              </p>
            </div>

            {/* 送信ボタン */}
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full font-bold text-lg py-4 rounded-lg shadow-md transition ${
                isLoading 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:-translate-y-1'
              }`}
            >
              {isLoading ? 'アップロード処理中...' : 'アップロードしてAI素材に追加'}
            </button>
          </form>

          {/* 結果メッセージ */}
          {status && (
            <div className={`mt-6 p-4 rounded-lg font-medium text-sm ${status.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
