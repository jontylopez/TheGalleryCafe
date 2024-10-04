<?php
header('Content-Type: application/json');
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "gallery_cafe";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

if (!isset($_SESSION['username'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit();
}

$uName = $_SESSION['username'];

// Fetch form data
$name = $_POST['name'];
$guest_count = $_POST['guest-count'];
$date = $_POST['date'];
$arrival_time = $_POST['arrival-time'];
$parking_space = $_POST['parking-space'];


$sql = "INSERT INTO temp_reservations (uName, name, guest_count, date, time, parking_space) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssisss", $uName, $name, $guest_count, $date, $arrival_time, $parking_space);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Reservation request submitted successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to submit reservation request']);
}

$stmt->close();
$conn->close();
?>
