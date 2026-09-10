import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside style={{ width: '300px', flexShrink: 0, paddingLeft: '20px' }}>
      {/* カテゴリ */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '16px', borderBottom: '2px solid #0070f3', paddingBottom: '8px', marginBottom: '16px' }}>
          📁 カテゴリ
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {['ビジネス戦略', 'マーケティング', '自動化ツール', '副業'].map(tag => (
            <span key={tag} style={{ background: '#f5f5f5', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', color: '#555' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* アフィリエイト・広告枠 */}
      <div style={{ background: '#f9f9f9', border: '1px dashed #ccc', padding: '40px 20px', textAlign: 'center', color: '#999', fontSize: '12px' }}>
        アフィリエイトバナー広告枠<br/>（300x250等）
      </div>
    </aside>
  );
}