<?php

session_start();

//session_destroy(); // 모든 세션 삭제
//$_SESSION = array(); // 세션 변수 전체 초기화
unset($_SESSION['check']); // 

header('Location:../');