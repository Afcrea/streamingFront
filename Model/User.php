<?php

namespace userModel;

class user {
    private $host = "127.0.0.1";
    private $user = "root";
    private $pw = "qwe123";
    private $dbName = "php";

    public $conn, $stmt;

    public function __construct(){
        $this->conn = new \mysqli($this->host, $this->user, $this->pw, $this->dbName);

        if($this->conn === false){
            die("ERROR: Could not connect. "
                . mysqli_connect_error());
        }

        $this->stmt = $this->conn->stmt_init();
    }
    
    public function select($email){

        $sql  = "SELECT * FROM users 
        WHERE email = ?";

        $this->stmt->prepare($sql);

        $this->stmt->bind_param("s", $email);

        $this->stmt->execute();
        $result = $this->stmt->get_result();
        //$result = mysqli_query($this->conn, $sql);

        $row = $result->fetch_array(MYSQLI_ASSOC);
        //$row = mysqli_fetch_array($result);

        return $row;
    }

    public function selectLogin($email, $password){
        $sql  = "SELECT email, password FROM users 
         WHERE email = ? AND password = ?";

        $this->stmt->prepare($sql);
        //var_dump($this->stmt->bind_param);
        $this->stmt->bind_param("ss", $email, $password);

        $this->stmt->execute();
        $result = $this->stmt->get_result();
        //$result = mysqli_query($this->conn, $sql);

        $row = $result->fetch_array(MYSQLI_ASSOC);
        //$row = mysqli_fetch_array($result);

        return $row;
    }
}

?>