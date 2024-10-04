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

$uName = $_SESSION['username'];

$data = json_decode(file_get_contents("php://input"), true);
$items = json_encode($data['items']);
$total = $data['total'];
$customer_id = 1; // Here we replace with actual customer ID from session


$sql = "INSERT INTO temp_orders (uName, customer_id, items, total_price) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sisd", $uName, $customer_id, $items, $total);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Order placed successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to place order: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
