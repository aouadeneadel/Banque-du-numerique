<?php
// filepath: [get_devices.php](http://_vscodecontentref_/0)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
require_once __DIR__ . '/connexion.php';

$result = $conn->query("SELECT * FROM materiel ORDER BY idMateriel ASC");
$devices = [];
while ($row = $result->fetch_assoc()) {
    $devices[] = $row;
}
echo json_encode(['devices' => $devices]);