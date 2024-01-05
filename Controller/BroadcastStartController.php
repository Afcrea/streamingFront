<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

require '../Model/Broadcast.php';
require '../Model/User.php';
require '../Model/Host.php';
use broadcastModel\broadcast;
use userModel\user;
use hostModel\host;

session_start();

$user = new user();
$broadcast = new broadcast();
$host = new host();

$row = $user->select($_SESSION['email']);

$user_id = $row['id'] ;

// public function create($title, $description, $stream_key, $category, $email, $user_id)

// echo $_REQUEST['title'] . " / " . $_REQUEST['description'] . " / " . $_REQUEST['stream_key'] . " / " . $_REQUEST['category'] . " / " . $user_id. " / " . $_SESSION['email'];

$broadcast->create($_REQUEST['title'], $_REQUEST['description'], $_REQUEST['stream_key'], $_REQUEST['category'], $_SESSION['email'], $user_id);

$host->create($_SESSION['email'], $user_id);

header("Location:../broadcast.php?channel=". $user_id);