import { NextRequest, NextResponse } from 'next/server';

const REPO_OWNER = 'shotaro0222';
const REPO_NAME = 'photo';

function sanitizeFileName(name: string) {
  return name
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-');
}

async function readJsonFileFromGitHub(token: string, path: string) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json'
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`GitHubからのファイル取得に失敗しました: ${res.status} ${errorText}`);
  }

  const data = await res.json();
  const content = Buffer.from(data.content, 'base64').toString('utf8');
  return { sha: data.sha, content: content ? JSON.parse(content) : [] };
}

async function writeJsonFileToGitHub(token: string, path: string, content: unknown, sha?: string) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;
  const encoded = Buffer.from(JSON.stringify(content, null, 2), 'utf8').toString('base64');

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `Update media list for ${path}`,
      content: encoded,
      sha: sha || undefined,
      branch: 'main'
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`GitHubへの保存に失敗しました: ${res.status} ${errorText}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const token = String(formData.get('token') || '').trim();
    const alt = String(formData.get('alt') || '').trim();
    const file = formData.get('file');

    if (!token) {
      return NextResponse.json({ ok: false, error: 'GitHub token is required' }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: '画像ファイルが見つかりません' }, { status: 400 });
    }

    const safeName = sanitizeFileName(file.name || 'upload-image');
    const uniqueName = `${Date.now()}-${safeName}`;
    const filePath = `public/uploads/${uniqueName}`;
    const mediaPath = 'src/data/media.json';

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const base64Content = fileBuffer.toString('base64');

    const uploadRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
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
      const errorText = await uploadRes.text();
      return NextResponse.json({ ok: false, error: `画像アップロード失敗: ${uploadRes.status} ${errorText}` }, { status: 500 });
    }

    let mediaData: Array<{ id: string; url: string; alt: string }> = [];
    let mediaSha = '';

    try {
      const mediaFile = await readJsonFileFromGitHub(token, mediaPath);
      mediaData = Array.isArray(mediaFile.content) ? mediaFile.content : [];
      mediaSha = mediaFile.sha;
    } catch {
      mediaData = [];
      mediaSha = '';
    }

    const entry = {
      id: `media-${Date.now()}`,
      url: `/uploads/${uniqueName}`,
      alt: alt || file.name.replace(/\.[^/.]+$/, '') || 'アップロード画像'
    };

    await writeJsonFileToGitHub(token, mediaPath, [...mediaData, entry], mediaSha || undefined);

    return NextResponse.json({
      ok: true,
      message: '画像をアップロードしてメディア一覧へ追加しました',
      url: entry.url,
      alt: entry.alt
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || 'サーバー側でエラーが発生しました' }, { status: 500 });
  }
}
