<?php
require '../Model/User.php';

error_reporting(E_ALL);
ini_set("display_errors", 1);

session_start();

use userModel\user;

$myprofile = new user();

var_dump($_SESSION['email']);

$row = $myprofile->select($_SESSION['email']);

var_dump($row);

?>

<br><br>

<?php

foreach($row as $col){
    echo $col;
}
