<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

// $host = "localhost";
// $user = "root";
// $pw = "qwe123";
// $dbName = "php";

// $conn = new mysqli($host, $user, $pw, $dbName);

// if($conn === false){
//     die("ERROR: Could not connect. "
//         . mysqli_connect_error());
// }

// $email = $_REQUEST['email'];
// $password = $_REQUEST['password'];

// $sql  = "SELECT email, password FROM users 
//         WHERE email = '$email' AND password = '$password'";

// $result = mysqli_query($conn, $sql);

// $row = $result->fetch_array(MYSQLI_ASSOC);

require '../Model/User.php';
use userModel\user;

$login = new user();

$row = $login->selectLogin($_REQUEST['email'], $_REQUEST['password']);

//결과가 존재하면 세션 생성
if ($row != null) {
    session_start();
    $userInfo = $login->select($_REQUEST['email']);
    $_SESSION['name'] = $userInfo['name'];
    $_SESSION['email'] = $_REQUEST['email'];
    
    if(isset($_REQUEST['check'])){
        $_SESSION['check'] = $_REQUEST['check'];
    }
    
    echo "<script>location.replace('../broadList.php');</script>";
    exit;
 }
 
 //결과가 존재하지 않으면 로그인 실패
 if($row == null){
    echo "<script>alert('Invalid username or password')</script>";
    echo "<script>location.replace('../');</script>";
    exit;
 }
 