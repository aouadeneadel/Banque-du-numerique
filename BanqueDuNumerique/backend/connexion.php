
<?php
$config = require __DIR__ . '/db.php';

$conn = @new mysqli(
    $config['db_host'],
    $config['db_user'],
    $config['db_pass'],
    $config['db_name']
);

if ($conn->connect_error) {
    $conn = false;
}