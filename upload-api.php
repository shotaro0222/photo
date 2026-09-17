<?php
// クロスドメイン（CORS）通信を許可
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// プリフライトリクエスト対応
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// 設置されたサーバーのドメインを自動取得（fudan-photo.com や re-skill0.com など）
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
$host = $_SERVER['HTTP_HOST'];

// 保存先ディレクトリとJSONファイルのパス
$uploadDir = __DIR__ . '/uploads/'; 
$jsonFile  = __DIR__ . '/src/data/media.json';

// 画像が送信されたかチェック
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['image'];
    
    // ファイル名の重複を防ぐためタイムスタンプを付与
    $filename = time() . '_' . basename($file['name']);
    $targetPath = $uploadDir . $filename;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        // 画像の公開URL（自動判定）
        $publicUrl = $protocol . "://" . $host . "/uploads/" . $filename;
        
        // 代替テキスト（alt）
        $altText = isset($_POST['alt']) && $_POST['alt'] !== '' ? $_POST['alt'] : "記事の挿入画像";

        // media.json を読み込んで新しい画像を追記
        $currentData = [];
        if (file_exists($jsonFile)) {
            $jsonContent = file_get_contents($jsonFile);
            $currentData = json_decode($jsonContent, true) ?: [];
        }
        
        // 先頭に追加（最新の画像が上に来るように）
        array_unshift($currentData, ["url" => $publicUrl, "alt" => $altText]);
        
        // JSONを上書き保存
        file_put_contents($jsonFile, json_encode($currentData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

        echo json_encode(['success' => true, 'url' => $publicUrl, 'message' => 'アップロードとJSONの更新が完了しました！']);
    } else {
        echo json_encode(['success' => false, 'error' => 'ファイルの保存に失敗しました。uploadsフォルダの権限を確認してください。']);
    }
} else {
    echo json_encode(['success' => false, 'error' => '画像が選択されていないか、送信エラーが発生しました。']);
}
?>
