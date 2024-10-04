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
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit();
}


$cuisine_code = isset($_GET['cuisine']) ? $_GET['cuisine'] : null;

if ($cuisine_code) {
    $sql = "SELECT id, cuisine, nameF, price, quantity, descriptionF, imageF FROM foodmenu WHERE cuisine = ? ORDER BY nameF ASC";
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        echo json_encode(['status' => 'error', 'message' => 'SQL error']);
        exit();
    }
    $stmt->bind_param("s", $cuisine_code);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    $sql = "SELECT id, cuisine, nameF, price, quantity, descriptionF, imageF FROM foodmenu ORDER BY nameF ASC";
    $result = $conn->query($sql);
    if ($result === false) {
        echo json_encode(['status' => 'error', 'message' => 'SQL error']);
        exit();
    }
}

if ($result->num_rows > 0) {
    $menuItems = [];

    while ($row = $result->fetch_assoc()) {
        unset($row['quantity']); // Remove quantity fot public
        $row['imageF'] = base64_encode($row['imageF']); 
        $menuItems[] = $row;
    }

    echo json_encode(['status' => 'success', 'data' => $menuItems]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No food menu items found']);
}

$conn->close();
?>
