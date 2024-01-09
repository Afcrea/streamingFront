const broadcastStartButton = document.getElementById('broadcastStart');
const overlay = document.getElementById('overlay');
const modal = document.getElementById('modal');
const streamKeyInput = document.getElementById('streamKey');
const broadcastTitleInput = document.getElementById('broadcastTitle');
const broadcastDescriptionInput = document.getElementById('broadcastDescription');
const categorySelect = document.getElementById('category');
const startButton = document.getElementById('startButton');
const cancelButton = document.getElementById('cancelButton');
const toggleStreamKeyIcon = document.getElementById('toggleStreamKey');

broadcastStartButton.addEventListener('click', () => {
    getStreamkey();
    overlay.style.display = 'block';
    modal.style.display = 'block';
    
});

cancelButton.addEventListener('click', () => {
    overlay.style.display = 'none';
    modal.style.display = 'none';
});

startButton.addEventListener('click', () => {
    overlay.style.display = 'none';
    modal.style.display = 'none';
    // 시작 버튼 클릭 시의 동작 추가
});

// 눈모양 누를 때 스트림 키 값 타입 변경 함수
function toggleStreamKeyVisibility() {
    if (streamKeyInput.type === 'password') {
        streamKeyInput.type = 'text';
        toggleStreamKeyIcon.classList.remove('fa-eye-slash');
        toggleStreamKeyIcon.classList.add('fa-eye');
    } else {
        streamKeyInput.type = 'password';
        toggleStreamKeyIcon.classList.remove('fa-eye');
        toggleStreamKeyIcon.classList.add('fa-eye-slash');
    }
}

// 복사 버튼
function copyToClipboard() {
    if (streamKeyInput.type === 'password') {
        streamKeyInput.type = 'text';
        streamKeyInput.select();
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
        streamKeyInput.type = 'password';
    } else {
        streamKeyInput.select();
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
    }
}

function startStream() {
    const apiUrl = `${apiServer}/startStream`;
//    console.log(document.getElementById('broadcastTitle').value);
//    console.log(document.getElementById('broadcastDescription').value);
 //   console.log(document.getElementById('category').value);
    const headers = {
        'Content-Type': 'application/json',
    };

    const authToken = getCookie('LoginToken');
    if (authToken) {
        headers['Authorization'] = 'Bearer ' + authToken;
    }

    const postData = {
        title: document.getElementById('title').value,
        
        description: document.getElementById('description').value,
        
        category: document.getElementById('category').value,
    };
    // fetch 함수를 사용하여 POST 요청 axios로 수정 예정
    fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(postData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // 비동기 작업이 완료된 후에 리다이렉션 수행
        setTimeout(() => {
            window.location.href = `${Server}`;
        }, 1000); // 1초 지연
        return true;
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function getStreamkey() {
    const apiUrl = `${apiServer}/getStreamkey`;

    const headers = {
        'Content-Type': 'application/json',
    };

    const authToken = getCookie('LoginToken');
    if (authToken) {
        headers['Authorization'] = 'Bearer ' + authToken;
    }

    // fetch 함수를 사용하여 POST 요청 axios로 수정 예정
    fetch(apiUrl, {
        method: 'GET',
        headers: headers,
    })
    .then(response => {
        // 응답이 성공적인지 확인
        if (!response.ok) {
            throw new Error('로그인 좀요');
        }
        else {
            return response.json();
        }
    })
    .then(data => {
        streamKeyInput.value = data.streamkey;
        return true;
    })
    .catch(error => {

        if(Error('로그인 좀요')){
            window.location.href = `${Server}/View/signin.html`;
        }
    });
}
