<?php
header('Content-Type: application/json');
session_start();
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

if (!isset($_SESSION['username'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit();
}

$username = $_SESSION['username'];

$sql = "SELECT date, time, 
        CASE 
            WHEN status = 1 THEN 'Table reserved' 
            WHEN status = 0 THEN 'Reservation Unsuccessful'
        END as status 
        FROM reservations WHERE uName = ?
        UNION
        SELECT date, time, 'Pending' as status FROM temp_reservations WHERE uName = ?";
$stmt = $conn->prepare($sql);
if ($stmt === false) {
    echo json_encode(['status' => 'error', 'message' => 'SQL error: ' . $conn->error]);
    exit();
}
$stmt->bind_param("ss", $username, $username);
$stmt->execute();
$result = $stmt->get_result();

$reservations = [];
while ($row = $result->fetch_assoc()) {
    $reservations[] = $row;
}

echo json_encode(['status' => 'success', 'data' => $reservations]);

$stmt->close();
$conn->close();
?>
