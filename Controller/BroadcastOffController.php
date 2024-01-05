<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

require '../Model/Broadcast.php';
require '../Model/Host.php';
use broadcastModel\broadcast;
use hostModel\host;

session_start();

$broadcast = new broadcast();
$host = new host();

$host->delete($_SESSION['email']);
$broadcast->delete($_SESSION['email']);


header('Location:../broadList.php');