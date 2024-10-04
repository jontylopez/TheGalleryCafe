<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "gallery_cafe";


$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

$sql = "SELECT * FROM temp_reservations";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $reservations = [];
    while ($row = $result->fetch_assoc()) {
        $reservations[] = $row;
    }
    echo json_encode(['status' => 'success', 'reservations' => $reservations]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No reservations found']);
}

$conn->close();
?>
