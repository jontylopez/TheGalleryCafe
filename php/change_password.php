<?php
session_start();
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


$username = $_SESSION['username']; 
$old_password = $_POST['old-password'];
$new_password = $_POST['new-password'];


$sql = "SELECT pWord FROM users WHERE uName = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->bind_result($db_password);
    $stmt->fetch();

    if (password_verify($old_password, $db_password)) {

        $new_password_hashed = password_hash($new_password, PASSWORD_DEFAULT);
        $sql = "UPDATE users SET pWord = ? WHERE uName = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $new_password_hashed, $username);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Password changed successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to change password']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Incorrect old password']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'User not found']);
}

$conn->close();
?>
