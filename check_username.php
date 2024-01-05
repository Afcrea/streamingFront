<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

// 데이터베이스 연결 설정
$host = "localhost";
$user = "root";
$password = "qwe123";
$database = "php";

$conn = new mysqli($host, $user, $password, $database);

// 아이디 중복 체크
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["email"])) {
    $username = $_POST["email"];
    
    $stmt = $conn->prepare("SELECT email FROM users WHERE email = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();
    
    if ($stmt->num_rows > 0) {
        echo "taken"; // 중복된 아이디
    } else {
        echo "available"; // 사용 가능한 아이디
    }

    $stmt->close();
}

$conn->close();
?>
