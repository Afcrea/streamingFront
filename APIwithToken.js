function isLogin() {
    // 페치 날려서 토큰값이 유효한지 검사로 수정하기
    if (getCookie('LoginToken')) {
        return true;
    }
    else {
        return false;
    }
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

    return 0;
}