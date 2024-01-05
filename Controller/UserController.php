<?php

error_reporting(E_ALL);
ini_set("display_errors", 1);

$host = "localhost";
$user = "root";
$pw = "qwe123";
$dbName = "php";

$conn = new mysqli($host, $user, $pw, $dbName);

if($conn === false){
    die("ERROR: Could not connect. "
        . mysqli_connect_error());
}

$name = $_REQUEST['name'];
$team = $_REQUEST['team'];
$email = $_REQUEST['email'];
$password = $_REQUEST['password'];

$duplication  = "SELECT email FROM users
        WHERE email = '$email'";
$row = mysqli_query($conn, $duplication)->fetch_array(MYSQLI_ASSOC);

if($row != null){
    echo "<script>alert('중복된 이메일입니다')</script>";
    echo "<script>location.replace('../View/signup.html');</script>";
    exit;
}

$sql  = "INSERT INTO users (name, team, email, password)
VALUES ('$name', '$team', '$email', '$password')";

if(mysqli_query($conn, $sql)){

    if($_REQUEST['check']){
        session_start();

        $_SESSION['email'] = $email;
        $_SESSION['check'] = $_REQUEST['check'];
    }
    
    echo "<script>alert('thanks for join !');</script>";

    echo "<script>location.replace('../');</script>";
} else{
    echo "ERROR: Hush! Sorry $sql. "
        . mysqli_error($conn);
}

mysqli_close($conn);