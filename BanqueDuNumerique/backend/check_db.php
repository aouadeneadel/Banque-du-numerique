<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require_once __DIR__ . '/connexion.php';

if ($conn) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}