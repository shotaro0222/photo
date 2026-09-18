<?php
// ★追加：PHPの警告（HTML）を画面に出さず、エラーメッセージをJSONとして返す最強のトラップ
ini_set('display_errors', 0);
set_error_handler(function($errno, $errstr) {
    echo json_encode(['success' => false, 'error' => 'サーバー側のエラー: ' . $errstr]);
    exit;
});

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
$host = $_SERVER['HTTP_HOST'];

$uploadDir = __DIR__ . '/uploads/'; 
$jsonDir   = __DIR__ . '/src/data/';
$jsonFile  = $jsonDir . 'media.json';

// フォルダとJSONがなければ作成
if (!file_exists($uploadDir)) { mkdir($uploadDir, 0777, true); }
if (!file_exists($jsonDir)) { mkdir($jsonDir, 0777, true); }
if (!file_exists($jsonFile)) { file_put_contents($jsonFile, '[]'); }

if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['image'];
    $filename = time() . '_' . basename($file['name']);
    $targetPath = $uploadDir . $filename;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        $publicUrl = $protocol . "://" . $host . "/uploads/" . $filename;
        $altText = isset($_POST['alt']) && $_POST['alt'] !== '' ? $_POST['alt'] : "記事の挿入画像";

        $currentData = [];
        if (file_exists($jsonFile)) {
            $jsonContent = file_get_contents($jsonFile);
            $currentData = json_decode($jsonContent, true) ?: [];
        }
        
        array_unshift($currentData, ["url" => $publicUrl, "alt" => $altText]);
        file_put_contents($jsonFile, json_encode($currentData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

        echo json_encode(['success' => true, 'url' => $publicUrl, 'message' => 'アップロードとJSONの更新が完了しました！']);
    } else {
        echo json_encode(['success' => false, 'error' => 'ファイルの保存に失敗しました。uploadsフォルダの権限を確認してください。']);
    }
} else {
    // なぜファイルが受け取れなかったかの詳細エラーコードを出力
    $uploadError = isset($_FILES['image']) ? 'エラーコード: ' . $_FILES['image']['error'] : 'ファイルが空です';
    echo json_encode(['success' => false, 'error' => '画像送信エラー: ' . $uploadError]);
}
?>
