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
    echo json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $conn->connect_error]);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

$id = $data['id'];
$field = $data['field'];
$value = $data['value'];

// Here we update user data in the database
$sql = "UPDATE users SET $field = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('si', $value, $id);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to update user']);
}

$stmt->close();
$conn->close();
?>
