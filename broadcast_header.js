// DOM 변수 선언
const output = document.getElementById('output');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const outButton = document.getElementById('outChat');
const testButton = document.getElementById('test');
const bandwidthButton = document.getElementById('bandwidth');
let channel;
let user;
const userDataDiv = document.getElementById('userData');
const video = document.getElementById('video');
let userEmail = '익명';
let videoSrc; 
let quality = '';
let streamKey;
// const apiServer = `https://www.broat.shop/api/Laravel`;
// const Server = `https://www.broat.shop`;



// 웹 소켓 연결 생성 IIFE 로 바로 연결
let socket;

// 58초 마다 연결 유지 인터벌 선언
let connPing = PingInterval(socket);

// 58초 마다 통신 인터벌 설정 함수
function PingInterval(connSocket) {
    const limitTime = 10; // 유지 시간 550000ms 550초 9분10초
    let countPing = 0;
    const Ping = setInterval(() => {
        if (countPing < limitTime){
            send('ping');
            countPing += 1;
        }
    }, 55000);

    return Ping
}

// 기본 정보
(async function main(){
    document.getElementById('offButton').innerHTML = ``;
    videoSrc = await getVideoSrc();
    updateVideo();

    if(isLogin()){
        user = await getUser();
        userEmail = user.user.email;
        // console.log(typeof user.user.id);
        // console.log(typeof channel);
        if(user.user.id === channel){
            // console.log("?");
            document.getElementById('offButton').innerHTML = `<button onclick="offBroadcast()">방송 종료</button>`;
        }
    }
})();

// 스트림 키 요청
async function getVideoSrc() {

    // 채널 정보 가져오기
    getChannel();

    // 현재 채널의 방송 정보 가져오기
    const Host = await getHost(channel);

    if(Host.Host != null) {
        streamKey = Host.Host.stream_key;
        console.log(streamKey);
        return StreamServer + "/hls/" + streamKey + quality + ".m3u8";
    }
    else {
        streamKey = "111";
        return Server + "/stream/uploaded/ts/111.m3u8"
    }

    // return "http://10.200.50.82:8088/hls_quality/" + Host.Host.stream_key + ".m3u8";
    // return "http://10.200.50.82:8088/hls/" + streamKey + quality + ".m3u8";
    // return "http://10.200.50.82:8088/uploaded/ts/456001.ts";
    // return "http://10.200.50.82:8088/uploaded/ts/111.m3u8";
}

// 채널 정보 가져오기
async function getChannel() {
    const currentUrl = window.location.href;
    const urlParams = new URLSearchParams(currentUrl.split('?')[1]);
    channel = Number(urlParams.get('channel'));

    document.getElementById('chatingname').innerHTML = "<h1>" + channel + " 채널</h1>";
}

// 접속유저 정보 받아오기
async function getUser() {
    if (isLogin()) {
        const apiUrl = apiServer + '/getUser';

        const headers = {
            'Content-Type': 'application/json',
        };

        const authToken = getCookie('LoginToken');

        headers['Authorization'] = 'Bearer ' + authToken;

        return new Promise((resolve, reject) => {
            // NewSocket.onopen = () => {
            //     resolve(NewSocket);
            // };
            // NewSocket.onerror = (error) => {
            //     reject(error);
            // };
            // fetch 함수를 사용하여 POST 요청 axios로 수정 예정
            fetch(apiUrl, {
                method: 'POST',
                headers: headers,
            })
            .then(response => {
                // 응답이 성공적인지 확인
                if (!response.ok) {
                    new Error('Network response was not ok');
                }

                return response.json();
            })
            .then(data => {
                
                return resolve(data);
            })
            .catch(error => {
                // 오류 처리
                console.error('There was a problem with the fetch operation:', error);
                alert('Error: ' + error.message);
            });
            
        });
    }
    else {
        return new Promise((resolve, reject) => {
            console.log("asd");
           return resolve; 
        });
    }
}

// 현재 채널의 방송 정보 조회
async function getHost(channel) {
    const apiUrl = apiServer + '/getHost/' + channel;

    // const postData = {
    //     'user_id' : channel,
    // }

    const headers = {
        'Content-Type': 'application/json',
    };

    return new Promise((resolve, reject) => {
        fetch(apiUrl, {
            method: 'GET',
            headers: headers,
            // body: JSON.stringify(postData)
        })
        .then(response => {
            // 응답이 성공적인지 확인
            if (!response.ok) {
                new Error('Network response was not ok');
            }

            return response.json();
        })
        .then(data => {
            return resolve(data);
        })
        .catch(error => {
            // 오류 처리
            console.error('There was a problem with the fetch operation:', error);
            alert('Error: ' + error.message);
        });
        
    });
}

// videoSrc 설정 및 hls 설정
function updateVideo() {
    // HLS 지원
    if (Hls.isSupported()) { 
        const hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.muted = 'muted';
            video.autoplay = 'autoplay';
            video.playsinline = 'true';
            video.play();
        });
    }
    // HLS 지원하지 않는 경우 메타데이터 로드
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoSrc;
        video.addEventListener('loadedmetadata', function () {
            video.muted = 'muted';
            video.autoplay = 'autoplay';
            video.playsinline = 'true';
            video.play();
        });
    }
}

// 대역폭 측정 함수
function calBandwidth() {
    return hls.bandwidthEstimate;
}

// 방송 종료 버튼 API
function offBroadcast(){
    const apiUrl = apiServer + '/endStream';

    const headers = {
        'Content-Type': 'application/json',
    };

    const authToken = getCookie('LoginToken');
    if (authToken) {
        headers['Authorization'] = 'Bearer ' + authToken;
    }

    // fetch 함수를 사용하여 POST 요청 axios로 수정 예정
    fetch(apiUrl, {
        method: 'POST',
        headers: headers,
    })
    .then(response => {
        // 응답이 성공적인지 확인
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();
    })
    .then(data => {
        // 방송 종료 요청 성공 후 메인페이지로 이동
        window.location.href = `${Server}`;
    })
    .catch(error => {
        // 오류 처리
        console.error('There was a problem with the fetch operation:', error);
        alert('Error: ' + error.message);
    });
}

// 화질 설정
let quality_map = new Map();
quality_map.set('360p', '_low');
quality_map.set('480p', '_mid');
quality_map.set('720p', '_high');
quality_map.set('1080p', '_1080p');
quality_map.set('자동', '');

async function changeQuality(selectedQuality) {
    quality = quality_map.get(selectedQuality);
    videoSrc = await getVideoSrc();
    updateVideo();

    console.log("Selected Quality: " + selectedQuality);

    const qualityOptions = document.querySelectorAll('.quality-option');
    qualityOptions.forEach(option => {
        option.classList.remove('selected');
        if (option.innerText === selectedQuality) {
            option.classList.add('selected');
        }
    });
}
