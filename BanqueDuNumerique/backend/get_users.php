<?php
// get_users.php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$dbconf = require __DIR__ . '/db.php';

try {
    $dsn = "mysql:host={$dbconf['db_host']};dbname={$dbconf['db_name']};charset={$dbconf['db_charset']}";
    $pdo = new PDO($dsn, $dbconf['db_user'], $dbconf['db_pass'], array(
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ));
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array('error' => 'Erreur connexion DB: ' . $e->getMessage()));
    exit;
}

// Récupérer tous les utilisateurs avec email
$stmt = $pdo->query('SELECT id, email, nomDemandeur FROM Convention WHERE email IS NOT NULL');
$users = $stmt->fetchAll();

echo json_encode($users);
