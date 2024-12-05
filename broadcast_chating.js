// WebSocket 서버 주소
//const serverUrl = 'wss://www.broat.shop/chat';
// const serverUrl = 'ws://10.200.50.83:8010';
const serverUrl = 'ws://211.188.55.250:8020';

// 소켓 연결 후 핑 메시지 전송
(async function () {
    socket = await SocketConnection();
    send('ping');
})();

// 소켓 연결하고 이벤트 등록하는 함수
async function SocketConnection() {
    const NewSocket = new WebSocket(serverUrl);

    // 연결이 열릴 때 실행되는 이벤트 핸들러
    NewSocket.addEventListener('open', (event) => {
        output.innerHTML += '<p>웹 소켓 연결이 열렸습니다.</p>';
    });

    // 메시지를 수신했을 때 실행되는 이벤트 핸들러
    NewSocket.addEventListener('message', (event) => {
        // 데이터를 JSON으로 파싱
        try {
            // 데이터에서 JSON 부분만 추출
            const rawData = event.data.trim();
            const jsonData = rawData.substring(rawData.indexOf('{')); // JSON 시작 부분부터 추출

            const data = JSON.parse(jsonData); // JSON 문자열을 객체로 변환
            const sender = data.sender || 'Unknown'; // sender 값
            const text = data.text || ''; // text 값

            // sender와 text를 화면에 출력
            output.innerHTML += `<p><strong>${sender}:</strong> ${text}</p>`;

            // 스크롤 자동 이동
            let chatDiv = document.getElementById('output');
            chatDiv.scrollTo({
                top: chatDiv.scrollHeight
            });
        } catch (error) {
            console.error('Invalid JSON:', event.data);
        }
    });

    // 연결이 닫혔을 때 실행되는 이벤트 핸들러
    NewSocket.addEventListener('close', (event) => {
        output.innerHTML += '<p>웹 소켓 연결이 닫혔습니다.</p>';
    });

    // 에러가 발생했을 때 실행되는 이벤트 핸들러
    NewSocket.addEventListener('error', (event) => {
        output.innerHTML += '<p>에러: ' + event.message + '</p>';
    });

    return new Promise((resolve, reject) => {
        NewSocket.onopen = () => {
            resolve(NewSocket);
        };
        NewSocket.onerror = (error) => {
            reject(error);
        };
    });
}

// 웹 소켓 연결 확인하여 메시지 전송 함수
async function send(message) {
    // 전송 데이터 JSON 형식
    const data = {
        channel: channel,
        text: message,
        sender: userEmail, 
    };

    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(data));
        if(data.text != "ping") {
            output.innerHTML += `<p><strong>${data.sender} : </strong> ${data.text}</p>`;
        }
    }
    else {
        console.error('Socket is not in the "OPEN" state. Attempting to create a new socket connection...');
        try {
            socket = await SocketConnection(); // 새로운 소켓 커넥션 만들기
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(data)); // 새로운 소켓이 열려있으면 메시지 보내기
            } 
            else {
                console.error('New socket is not in the "OPEN" state. Message not sent.');
            }
        } catch (error) {
            console.error('Failed to create a new socket connection:', error);
        }
    }
}

// -----------------------  이벤트 핸들러  ----------------------- //

// 나가기 버튼 ( 웹 소켓 연결 끊기 테스트 용으로 만듦) - 이벤트 핸들러
outButton.addEventListener('click', () => {
    socket.close();
});

// massage input box에서 엔터(code:13)키 up 할 때 전송 - 이벤트 핸들러
messageInput.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        sendButton.click();
    }
});

// 메시지 전송 버튼 클릭 - 이벤트 핸들러
sendButton.addEventListener('click', () => {
    // 연결 유지를 위한 58초 마다하는 통신 해제
    clearInterval(connPing);
    // 메시지 전송
    const message = messageInput.value;
    send(message);
    messageInput.value = '';

    // 연결 유지를 위한 58초 마다하는 통신 재개
    connPing = PingInterval(socket);
});

// 테스트용 버튼 - 이벤트 핸들러
testButton.addEventListener('click', () => {
    let i = 500111;
    while(i > 0){
        send("테스트중입니다." + i);
        i -= 1;
    }
});

