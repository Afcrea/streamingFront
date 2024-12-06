let row;
// const apiServer = `https://www.broat.shop/api/Laravel`;
// const Server = `https://www.broat.shop`;

(async function getStream() {
    const apiUrl = apiServer + '/getStream';
    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // 이미 JSON 형태로 자동 변환되어 있음
        row = await response.json();
        // row를 받아온 후에 화면 갱신을 위한 함수 호출
        updateBroadcastsList();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        alert('Error: ' + error.message);
    }
})();

function updateBroadcastsList() {
    let broadcastsList;

    if (!Array.isArray(row.broadcasts)) {
        console.error('Invalid data format. Expected an array.');
        broadcastsList = '<h1>Error: Invalid data format</h1>';
    } else if (row.broadcasts.length === 0) {
        broadcastsList = '<h1>진행 중인 방송이 없습니다</h1>';
    } else {
        broadcastsList = '';
        row.broadcasts.forEach(broadcast => {
            broadcastsList += `
                <div>
                    <img src="./stream/Img/img.png" onclick="location.href='broadcast.html?channel=${broadcast.user_id}'">
                    <p id="broadcastTitle">${broadcast.title}</p>
                    <p id="broadcastDescription">${broadcast.description} </p>
                    <p id="broadcastCategory">${broadcast.category} By ${broadcast.name}</p>
                </div>
            `;
        });
    }

    document.getElementsByClassName('broadcastList')[0].innerHTML = broadcastsList;
}
