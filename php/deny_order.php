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
$orderId = $data['orderId'];


$sql = "INSERT INTO orders (uName, customer_id, items, total_price, status)
        SELECT uName, customer_id, items, total_price, 0 FROM temp_orders WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $orderId);

if ($stmt->execute()) {
    
    $sql = "DELETE FROM temp_orders WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $orderId);
    $stmt->execute();

    echo json_encode(['status' => 'success', 'message' => 'Order denied']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to deny order']);
}

$stmt->close();
$conn->close();
?>
