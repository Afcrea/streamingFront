<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

require '../Model/Broadcast.php';
use broadcastModel\broadcast;

$broadcast = new broadcast();

$row = $broadcast->read();

// 브로드캐스트 목록 출력
foreach ($row as $broadcasts) {
    echo "<div>";
    echo '<img src="./stream/Img/img.png" onclick="location.href=\'broadcast.php\'">';
    echo "<h2>Title: " . $broadcasts['title'] . "</h2>";
    echo "<p>Description: " . $broadcasts['description'] . "</p>";
    echo "<p>Category: " . $broadcasts['category'] . "</p>";
    echo "</div>";
}