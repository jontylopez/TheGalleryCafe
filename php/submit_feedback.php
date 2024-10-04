<?php
session_start();
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "gallery_cafe";

// Debug statement to check session variables
if (!isset($_SESSION['username'])) {
    die(json_encode(['status' => 'error', 'message' => 'User not logged in', 'session' => $_SESSION]));
}

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $conn->connect_error]));
}

// Retrieve session username
$uName = $_SESSION['username']; 

// Get user details
$sql = "SELECT fName, email FROM users WHERE uName = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $uName);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($fName, $email);
$stmt->fetch();

if ($stmt->num_rows > 0) {
    $feedback = $_POST['message'];

   
    $sql = "INSERT INTO feedback (fName, uName, email, feedback) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $fName, $uName, $email, $feedback);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Feedback submitted successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to submit feedback']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'User not found']);
}

$conn->close();
?>
