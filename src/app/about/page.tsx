import aboutData from '../../data/about.json';

export default function AboutPage() {
  return (
    <div style={{ padding: '20px', lineHeight: '1.8' }}>
      <h1 style={{ borderBottom: '2px solid #eaeaea', paddingBottom: '10px', marginBottom: '30px' }}>
        運営者情報
      </h1>
      
      <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '24px', margin: '0 0 5px 0', color: '#333' }}>
          {aboutData.name}
        </h2>
        <p style={{ fontWeight: 'bold', color: '#0070f3', margin: '0 0 20px 0' }}>
          {aboutData.role}
        </p>
        
        {/* 改行コード（\n）を反映してテキストを表示 */}
        <div style={{ color: '#555', fontSize: '15px' }}>
          {aboutData.content.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}