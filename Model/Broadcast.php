<?php

namespace broadcastModel;

class broadcast {
    private $host = "localhost"; // 수정
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

    // 방송 목록 가져오기
    public function read() {
        $sql = "SELECT * FROM broadcasts";
        
        $this->stmt->prepare($sql);

        $this->stmt->execute();
        $result = $this->stmt->get_result();

        $broadcasts = array();

        while ($row = $result->fetch_assoc()) {
            $broadcasts[] = $row;
        }

        return $broadcasts;
    }

    // 방송 생성
    public function create($title, $description, $stream_key, $category, $email, $user_id) {
        $sql = "INSERT INTO `broadcasts` (`title`, `description`, `stream_key`, `category`, `user_email`, `user_id`) 
                VALUES (?, ?, ?, ?, ?, ?)";

        $this->stmt->prepare($sql);
        $this->stmt->bind_param("sssssi", $title, $description, $stream_key, $category, $email, $user_id);

        return $this->stmt->execute();
    }

    // 방송 업데이트
    public function update($broadcast_id, $title, $description, $broadcast_date, $stream_key, $category) {
        $sql = "UPDATE broadcasts 
                SET title = ?, description = ?, broadcast_date = ?, stream_key = ?, category = ? 
                WHERE id = ?";

        $this->stmt->prepare($sql);
        $this->stmt->bind_param("sssssi", $title, $description, $broadcast_date, $stream_key, $category, $broadcast_id);

        return $this->stmt->execute();
    }

    // 방송 삭제
    public function delete($email) {
        $sql = "DELETE FROM broadcasts WHERE user_email = ?";

        $this->stmt->prepare($sql);
        $this->stmt->bind_param("s", $email);

        return $this->stmt->execute();
    }

    // 스트림 키 가져오기
    public function getStreamKey($channel) {
        $sql = "SELECT stream_key FROM broadcasts where user_id = ?";
        
        $this->stmt->prepare($sql);
        $this->stmt->bind_param("i", $channel);

        $this->stmt->execute();

        $result = $this->stmt->get_result();

        return $result->fetch_assoc();
    }

    // 방송 중인 유저 가져오기
    public function getHost($stream_key){
        $sql = "SELECT * FROM broadcasts where stream_key = ?";
        
        $this->stmt->prepare($sql);
        $this->stmt->bind_param("s", $stream_key);

        $this->stmt->execute();

        $result = $this->stmt->get_result();

        return $result->fetch_assoc();
    }
}

// CREATE TABLE IF NOT EXISTS broadcasts (
//     user_id INT NOT NULL PRIMARY KEY,
//     user_email VARCHAR(255) NOT NULL,
//     title VARCHAR(255) NOT NULL,
//     description TEXT,
//     broadcast_date DATE,
//     stream_key VARCHAR(255) NOT NULL,
//     category VARCHAR(255) NOT NULL,
//     FOREIGN KEY (user_id) REFERENCES users(id)
// );

// CREATE TABLE IF NOT EXISTS hosts (
//         host_id INT NOT NULL AUTO_INCREMENT;
//         host_email VARCHAR(255) NOT NULL,
//         channel INT NOT NULL PRIMARY KEY,
//         FOREIGN KEY (channel) REFERENCES broadcasts(user_id)
//     );