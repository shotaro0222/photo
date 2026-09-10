// src/app/hub/page.tsx
import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: '総合評価レポート無料プレゼント | あなたの現在地をチェック',
  description: '戦略、スキル、メンタルの3軸から、あなたのビジネスの持続可能性を診断する無料レポートをプレゼント。',
};

export default function HubPage() {
  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '60px 20px', fontFamily: 'sans-serif' }}>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        
        {/* ヘッダーエリア */}
        <div style={{ backgroundColor: '#1e293b', padding: '50px 30px', textAlign: 'center', color: '#fff' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 16px 0', lineHeight: '1.4' }}>
            あなたのビジネス、<br />
            “心・技・体” は整っていますか？
          </h1>
          <p style={{ fontSize: '16px', color: '#cbd5e1', lineHeight: '1.6', margin: '0' }}>
            個人が持続可能にビジネスを行い、自立し続けるためには、<br />
            単なるスキルやノウハウだけでなく、3つのバランスが不可欠です。
          </p>
        </div>

        {/* 3軸の解説エリア */}
        <div style={{ padding: '40px 30px' }}>
          <h2 style={{ fontSize: '22px', textAlign: 'center', color: '#0f172a', marginBottom: '30px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' }}>
            行き詰まる原因は、どれか1つの欠如かもしれません
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* 戦略 */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: '#ea580c', color: '#fff', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', flexShrink: 0 }}>体</div>
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#0f172a' }}>戦略とマインドセット（BizPioneer）</h3>
                <p style={{ margin: '0', fontSize: '15px', color: '#475569', lineHeight: '1.6' }}>どこへ向かうべきかの「羅針盤」。優れたサービスがあっても、戦う場所や心構えを間違えればビジネスは立ち行かなくなります。</p>
              </div>
            </div>
            
            {/* スキル */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: '#0070f3', color: '#fff', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', flexShrink: 0 }}>技</div>
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#0f172a' }}>実務・自動化スキル（Re:Skill Blog）</h3>
                <p style={{ margin: '0', fontSize: '15px', color: '#475569', lineHeight: '1.6' }}>前に進むための「エンジン」。気合いや根性だけでは限界が来ます。ITツールを活用し、個人の生産性を最大化する技術が必要です。</p>
              </div>
            </div>

            {/* メンタル */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: '#52796f', color: '#fff', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', flexShrink: 0 }}>心</div>
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#0f172a' }}>メンタル・マインドフルネス（Mindful Shutter）</h3>
                <p style={{ margin: '0', fontSize: '15px', color: '#475569', lineHeight: '1.6' }}>走り続けるための「メンテナンス」。どんなに戦略やスキルがあっても、心が折れてしまえばすべてがストップしてしまいます。</p>
              </div>
            </div>
          </div>
        </div>

        {/* フォームエリア（リスト獲得） */}
        <div style={{ backgroundColor: '#f1f5f9', padding: '40px 30px', borderTop: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '20px', textAlign: 'center', color: '#0f172a', marginBottom: '16px' }}>
            あなたの「現在地」を知る総合評価レポートを無料プレゼント
          </h2>
          <p style={{ textAlign: 'center', fontSize: '14px', color: '#475569', marginBottom: '30px', lineHeight: '1.6' }}>
            以下のフォームにご登録いただいた方に、3つの軸からあなたのビジネスの持続可能性を診断する「総合評価シート（PDF版）」と、個人が自立するための特別メール講座をお届けします。
          </p>

          <form style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input 
              type="email" 
              placeholder="メールアドレスを入力してください" 
              required 
              style={{ padding: '16px', fontSize: '16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', width: '100%', boxSizing: 'border-box' }}
            />
            <button 
              type="button" 
              onClick={() => alert('※ ここに実際のメール配信スタンド（Mailchimpなど）の送信処理を組み込みます')}
              style={{ backgroundColor: '#2563eb', color: '#fff', padding: '16px', fontSize: '16px', fontWeight: 'bold', borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'background 0.2s', width: '100%' }}
            >
              無料レポートを受け取る
            </button>
            <p style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', margin: '8px 0 0 0' }}>
              ※ 登録解除はいつでも可能です。プライバシーポリシーに同意の上ご登録ください。
            </p>
          </form>
        </div>

        {/* 戻るリンク */}
        <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fff' }}>
          <Link href="/" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
            ← サイトトップへ戻る
          </Link>
        </div>

      </div>
    </div>
  );
}
