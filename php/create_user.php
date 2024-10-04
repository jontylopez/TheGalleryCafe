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


if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $fName = $_POST['first-name'];
    $email = $_POST['email'];
    $uName = $_POST['new-username'];
    $password = $_POST['new-password'];
    $role = $_POST['new-role'];

    // Here we check validation for existing email, username, or telephone
    $sql_check = "SELECT * FROM users WHERE email = ? OR uName = ?";
    $stmt_check = $conn->prepare($sql_check);
    $stmt_check->bind_param("ss", $email, $uName);
    $stmt_check->execute();
    $result_check = $stmt_check->get_result();

    if ($result_check->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Email or Username already exists']);
        $stmt_check->close();
        exit();
    }
    $stmt_check->close();

   
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

   
    $sql_users = "INSERT INTO users (fName, email, uName, pWord, uRole) VALUES (?, ?, ?, ?, ?)";
    
   
    $stmt_users = $conn->prepare($sql_users);
    if (!$stmt_users) {
        echo json_encode(['status' => 'error', 'message' => 'Prepare statement failed: ' . $conn->error]);
        exit();
    }
    $stmt_users->bind_param("sssss", $fName, $email, $uName, $hashed_password, $role);

   
    $stmt_users_result = $stmt_users->execute();

   
    if ($stmt_users_result) {
        echo json_encode(['status' => 'success', 'message' => 'Registration successful!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error: ' . $stmt_users->error]);
    }

    $stmt_users->close();
}

$conn->close();
?>
