<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error_log.txt'); // Ensure this path is writable by your web server

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "gallery_cafe";


$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    error_log("Database connection failed: " . $conn->connect_error);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit();
}


$sql = "SELECT id, cuisine, nameF, price, quantity, descriptionF, imageF FROM foodmenu ORDER BY nameF ASC";
$result = $conn->query($sql);

if ($result === false) {
    error_log("SQL error: " . $conn->error);
    echo json_encode(['status' => 'error', 'message' => 'SQL error']);
    exit();
}

if ($result->num_rows > 0) {
    $menuItems = [];

    while ($row = $result->fetch_assoc()) {
        $row['imageF'] = base64_encode($row['imageF']); //This is how encode image data to base64
        $menuItems[] = $row;
    }

    echo json_encode(['status' => 'success', 'data' => $menuItems]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No food menu items found']);
}

$conn->close();
?>
