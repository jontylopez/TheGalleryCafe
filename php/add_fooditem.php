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


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $cuisine = $_POST['cuisine'];
    $nameF = $_POST['nameF'];
    $price = $_POST['price'];
    $quantity = $_POST['quantity'];
    $description = $_POST['description'];
    $imageF = file_get_contents($_FILES['imageF']['tmp_name']);


    $sql = "INSERT INTO foodmenu (cuisine, nameF, price, quantity, descriptionF, imageF) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    
    if ($stmt === false) {
        echo json_encode(['status' => 'error', 'message' => 'Prepare failed: ' . htmlspecialchars($conn->error)]);
        exit();
    }

    $stmt->bind_param("ssdisb", $cuisine, $nameF, $price, $quantity, $description, $imageF);

    $null = NULL;
    $stmt->send_long_data(5, $imageF);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Food item added successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Execute failed: ' . htmlspecialchars($stmt->error)]);
    }

    $stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}

$conn->close();
?>
