<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once __DIR__ . '/connexion.php';

$data = json_decode(file_get_contents('php://input'), true);

$id = intval($data['id'] ?? 0);
$type = $conn->real_escape_string($data['type'] ?? '');
$modele = $conn->real_escape_string($data['modele'] ?? '');
$marque = $conn->real_escape_string($data['marque'] ?? '');
$annee = intval($data['annee'] ?? 0);
$etat = $conn->real_escape_string($data['etat'] ?? '');
$numeroSerie = $conn->real_escape_string($data['numeroSerie'] ?? '');
$numeroInventaire = $conn->real_escape_string($data['numeroInventaire'] ?? '');

if (!$id || !$type || !$modele || !$marque || !$annee || !$etat || !$numeroSerie || !$numeroInventaire) {
    echo json_encode(['success' => false, 'error' => 'Champs manquants']);
    exit;
}

$sql = "UPDATE materiel SET 
            type='$type', modele='$modele', marque='$marque', annee=$annee, etat='$etat', 
            numeroSerie='$numeroSerie', numeroInventaire='$numeroInventaire'
        WHERE id=$id";
if ($conn->query($sql)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}