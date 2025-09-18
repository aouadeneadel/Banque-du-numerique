<?php
<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once __DIR__ . '/connexion.php';

$data = json_decode(file_get_contents('php://input'), true);

$type = $conn->real_escape_string($data['type'] ?? '');
$modele = $conn->real_escape_string($data['modele'] ?? '');
$marque = $conn->real_escape_string($data['marque'] ?? '');
$annee = intval($data['annee'] ?? 0);
$etat = $conn->real_escape_string($data['etat'] ?? '');
$numeroSerie = $conn->real_escape_string($data['numeroSerie'] ?? '');
$numeroInventaire = $conn->real_escape_string($data['numeroInventaire'] ?? '');
$dateAjout = date('Y-m-d');

if (!$type || !$modele || !$marque || !$annee || !$etat || !$numeroSerie || !$numeroInventaire) {
    echo json_encode(['success' => false, 'error' => 'Champs manquants']);
    exit;
}

$sql = "INSERT INTO devices (type, modele, marque, annee, etat, numeroSerie, numeroInventaire, dateAjout)
        VALUES ('$type', '$modele', '$marque', $annee, '$etat', '$numeroSerie', '$numeroInventaire', '$dateAjout')";
if ($conn->query($sql)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}