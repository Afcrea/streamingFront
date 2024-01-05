<?php

namespace hostModel;

class host {
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

    public function create($email, $channel) {
        $sql = "INSERT INTO hosts (host_email, channel) 
                VALUES (?, ?)";

        $this->stmt->prepare($sql);
        $this->stmt->bind_param("si", $email, $channel);

        return $this->stmt->execute();
    }

    public function delete($email) {
        $sql = "DELETE FROM hosts WHERE host_email = ?";

        $this->stmt->prepare($sql);
        $this->stmt->bind_param("s", $email);

        return $this->stmt->execute();
    }
}

?>