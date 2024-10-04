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
    $lName = $_POST['last-name'];
    $dob = $_POST['birth-day'];
    $mobile = $_POST['telephone'];
    $email = $_POST['email'];
    $address = $_POST['address'];
    $uName = $_POST['new-username'];
    $password = $_POST['new-password'];
    $role = "cus"; // this is the default role

    // check email already there
    $checkEmail = $conn->prepare("SELECT id FROM customer WHERE email = ?");
    $checkEmail->bind_param("s", $email);
    $checkEmail->execute();
    $checkEmail->store_result();
    if ($checkEmail->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Email already exists']);
        exit();
    }

    // check for existing username
    $checkUsername = $conn->prepare("SELECT id FROM customer WHERE uName = ?");
    $checkUsername->bind_param("s", $uName);
    $checkUsername->execute();
    $checkUsername->store_result();
    if ($checkUsername->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Username already exists']);
        exit();
    }

    // Check for existing telephone number
    $checkTelephone = $conn->prepare("SELECT id FROM customer WHERE mobile = ?");
    $checkTelephone->bind_param("s", $mobile);
    $checkTelephone->execute();
    $checkTelephone->store_result();
    if ($checkTelephone->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Telephone number already exists']);
        exit();
    }

    // Hash the password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Prepare SQL statements for both tables
    $sql_customer = "INSERT INTO customer (fName, lName, dob, mobile, email, adrs, uName, pWord, uRole)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $sql_users = "INSERT INTO users (fName, email, uName, pWord, uRole)
                  VALUES (?, ?, ?, ?, ?)";

   
    $stmt_customer = $conn->prepare($sql_customer);
    if (!$stmt_customer) {
        echo json_encode(['status' => 'error', 'message' => 'Prepare statement failed: ' . $conn->error]);
        exit();
    }
    $stmt_customer->bind_param("sssssssss", $fName, $lName, $dob, $mobile, $email, $address, $uName, $hashed_password, $role);

  
    $stmt_users = $conn->prepare($sql_users);
    if (!$stmt_users) {
        echo json_encode(['status' => 'error', 'message' => 'Prepare statement failed: ' . $conn->error]);
        exit();
    }
    $stmt_users->bind_param("sssss", $fName, $email, $uName, $hashed_password, $role);

    
    $stmt_customer_result = $stmt_customer->execute();

    
    $stmt_users_result = $stmt_users->execute();

    
    if ($stmt_customer_result && $stmt_users_result) {
        echo json_encode(['status' => 'success', 'message' => 'Registration successful!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error: ' . $stmt_customer->error . ' | ' . $stmt_users->error]);
    }

 
    $stmt_customer->close();
    $stmt_users->close();
}


$conn->close();
?>
