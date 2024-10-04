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
    die(json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $conn->connect_error]));
}


$sql = "SELECT fName, uName, email, feedback, created_at FROM feedback ORDER BY created_at DESC";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $feedbacks = [];

    while ($row = $result->fetch_assoc()) {
        $feedbacks[] = $row;
    }

    echo json_encode(['status' => 'success', 'data' => $feedbacks]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No feedbacks found']);
}

$conn->close();
?>
