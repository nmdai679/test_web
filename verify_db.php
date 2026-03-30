<?php
$conn = new mysqli('localhost', 'root', '', 'mcu_database');
$conn->set_charset('utf8mb4');
$res = $conn->query("SELECT description FROM movies WHERE id=1");
$row = $res->fetch_assoc();
$desc = $row['description'];

if (strpos($desc, 'chế tạo') !== false) {
    file_put_contents('verify.txt', 'PERFECT_MATCH');
} else {
    file_put_contents('verify.txt', 'CORRUPTED: ' . mb_convert_encoding($desc, 'UTF-8', 'auto'));
}
?>
