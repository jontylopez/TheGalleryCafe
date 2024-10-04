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

$data = json_decode(file_get_contents("php://input"), true);
$reservationId = $data['reservationId'];


$sql = "INSERT INTO reservations (uName, name, guest_count, date, time, parking_space, status)
        SELECT uName, name, guest_count, date, time, parking_space, 1 FROM temp_reservations WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $reservationId);

if ($stmt->execute()) {
    $sql = "DELETE FROM temp_reservations WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $reservationId);
    $stmt->execute();

    echo json_encode(['status' => 'success', 'message' => 'Reservation approved']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to approve reservation']);
}

$stmt->close();
$conn->close();
?>
