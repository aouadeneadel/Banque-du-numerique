<?php
// send_email_from_db.php
$config = require __DIR__ . '/config.php';
$dbconf = require __DIR__ . '/db.php';

require __DIR__ . '/PHPMailer/PHPMailer.php';
require __DIR__ . '/PHPMailer/SMTP.php';
require __DIR__ . '/PHPMailer/Exception.php';

// Si PHPMailer est inclus manuellement (sans Composer), pas besoin de namespace

header('Content-Type: application/json');

// Connexion à la base de données
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

// Exemple : récupérer tous les emails d'une table "utilisateurs"
$stmt = $pdo->query('SELECT email FROM utilisateurs WHERE email IS NOT NULL');
$emails = $stmt->fetchAll(PDO::FETCH_COLUMN);

if (!$emails) {
    http_response_code(404);
    echo json_encode(array('error' => 'Aucun email trouvé.'));
    exit;
}

// Sujet et message à personnaliser ou à recevoir en POST
$data = json_decode(file_get_contents('php://input'), true);
$subject = isset($data['subject']) ? $data['subject'] : 'Sujet par défaut';
$message = isset($data['message']) ? $data['message'] : 'Message par défaut';

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host = $config['smtp_host'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['smtp_username'];
    $mail->Password = $config['smtp_password'];
    $mail->SMTPSecure = $config['smtp_secure'];
    $mail->Port = $config['smtp_port'];
    $mail->setFrom($config['from_email'], $config['from_name']);
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body = $message;

    $sent = 0;
    foreach ($emails as $to) {
        $mail->clearAddresses();
        $mail->addAddress($to);
        $mail->send();
        $sent++;
    }
    echo json_encode(array('success' => true, 'sent' => $sent));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array('error' => $mail->ErrorInfo));
}
