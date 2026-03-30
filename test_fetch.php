<?php
$conn = new mysqli("localhost", "root", "", "mcu_database");
$conn->set_charset("utf8mb4");
$res = $conn->query("SELECT description FROM movies LIMIT 1");
$row = $res->fetch_assoc();
echo $row['description'];
?>
