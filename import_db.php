<?php
$conn = new mysqli("localhost", "root", "");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
// Force purely UTF-8 from the ground up
$conn->set_charset("utf8mb4");

// Start by clearing old DB
$conn->query("DROP DATABASE IF EXISTS mcu_database");

// The file contents (already UTF-8 bytes ideally)
$sql = file_get_contents("database/mcu_database.sql");

// Multi query
if ($conn->multi_query($sql)) {
    do {
        if ($res = $conn->store_result()) {
            $res->free();
        }
    } while ($conn->more_results() && $conn->next_result());
} else {
    echo "Error: " . $conn->error;
}
echo "Done";
?>
