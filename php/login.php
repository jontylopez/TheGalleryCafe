<?php
session_start();
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "gallery_cafe";

header('Content-Type: application/json');


$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $conn->connect_error]);
    exit();
}


if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {
   
    $uName = $_POST['uName1'];
    $pWord = $_POST['pWord1'];

 
    $sql = "SELECT uName, pWord, uRole FROM users WHERE uName = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $uName);
    $stmt->execute();
    $result = $stmt->get_result();

    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        
        if (password_verify($pWord, $row['pWord'])) {
            
            $_SESSION['username'] = $row['uName'];
            $_SESSION['role'] = $row['uRole'];

            echo json_encode(['status' => 'success', 'uRole' => $row['uRole']]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid username or password']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid username or password']);
    }

   
    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}


$conn->close();
?>
