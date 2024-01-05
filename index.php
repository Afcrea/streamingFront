<?php 

require   'Router.php';

session_start();

Router::add('get','/',function(){
        // if(isset($_SESSION['check'])){
        //     header('Location:/olduser');
        // }
        // else header('Location:/newuser');
        header("location:broadList.html");
});

Router::add('get','/olduser',function(){
    header("location:broadList.php");
});

Router::add('get','/newuser',function(){
    header( 'Location: /View/signin.html' );
});

Router::run();
?>


