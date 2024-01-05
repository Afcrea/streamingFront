function logout() {
    const apiUrl = 'http://10.200.50.82:8080/api/authLogout';

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
        // 로그아웃 요청 성공 후 토큰 삭제 후 메인페이지로 이동
        deleteCookie('LoginToken');
        window.location.href = 'http://10.200.50.82';
    })
    .catch(error => {
        // 오류 처리
        deleteCookie('LoginToken');
        console.error('There was a problem with the fetch operation:', error);
        alert('Error: ' + error.message);
    });
}

function getCookie(name) {
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split('=');
        const cookieName = cookie[0];
        const cookieValue = cookie[1];

        if (cookieName === name) {
            return cookieValue;
        }
    }

    return null;
}

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}