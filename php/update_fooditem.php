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

// Check if form is submitted and REQUEST_METHOD is set
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'];
    $field = $data['field'];
    $value = $data['value'];

    // Here Prepare SQL statement to update food item
    $sql = "UPDATE foodmenu SET $field = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $value, $id);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Food item updated successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update food item']);
    }

    
    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}


$conn->close();
?>
