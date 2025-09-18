<?php
// send_email.php
$config = require __DIR__ . '/config.php';

// Charger PHPMailer (via Composer ou manuellement)
require __DIR__ . '/PHPMailer/PHPMailer.php';
require __DIR__ . '/PHPMailer/SMTP.php';
require __DIR__ . '/PHPMailer/Exception.php';

// Si PHPMailer est inclus manuellement (sans Composer), pas besoin de namespace

// Autoriser les requêtes CORS (pour développement frontend)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Récupérer les données POST
$data = json_decode(file_get_contents('php://input'), true);

$to = isset($data['to']) ? $data['to'] : '';
$subject = isset($data['subject']) ? $data['subject'] : '';
$message = isset($data['message']) ? $data['message'] : '';


if (!$to || !$subject || !$message) {
    http_response_code(400);
    echo json_encode(array('error' => 'Champs requis manquants.'));
    exit;
}

$mail = new PHPMailer(true);
try {
    // Config SMTP
    $mail->isSMTP();
    $mail->Host = $config['smtp_host'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['smtp_username'];
    $mail->Password = $config['smtp_password'];
    $mail->SMTPSecure = $config['smtp_secure'];
    $mail->Port = $config['smtp_port'];

    // Expéditeur
    $mail->setFrom($config['from_email'], $config['from_name']);
    $mail->addAddress($to);
    $mail->Subject = $subject;
    $mail->Body = $message;
    $mail->isHTML(true);

    $mail->send();
    echo json_encode(array('success' => true));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array('error' => $mail->ErrorInfo));
}
