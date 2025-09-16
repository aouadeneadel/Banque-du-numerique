<?php
// get_devices.php
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

// Récupérer tous les appareils (PCs et Smartphones)
$stmt = $pdo->query('SELECT idMateriel AS id, typeDemande AS type, marque, numSerie AS numeroSerie, numInventaire AS numeroInventaire, nombre, "" AS etat, "" AS modele FROM Materiel');
$devices = $stmt->fetchAll();

echo json_encode($devices);
