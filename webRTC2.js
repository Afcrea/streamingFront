const startButton = document.getElementById('startButton');
const hangupButton = document.getElementById('hangupButton');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

let localStream;
let pc1;
let pc2;

startButton.addEventListener('click', start);
hangupButton.addEventListener('click', hangup);

async function start() {
    startButton.disabled = true;
    hangupButton.disabled = false;

    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        localVideo.srcObject = stream;
        localStream = stream;

        const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
        pc1 = new RTCPeerConnection(configuration);
        pc2 = new RTCPeerConnection(configuration);

        pc1.addEventListener('icecandidate', (event) => handleIceCandidate(pc1, event));
        pc2.addEventListener('icecandidate', (event) => handleIceCandidate(pc2, event));

        pc2.addEventListener('iceconnectionstatechange', () => handleConnectionStateChange(pc2));

        pc2.addEventListener('track', gotRemoteStream);

        localStream.getTracks().forEach(track => pc1.addTrack(track, localStream));

        const offer = await pc1.createOffer();
        await pc1.setLocalDescription(offer);
        await pc2.setRemoteDescription(offer);

        const answer = await pc2.createAnswer();
        await pc2.setLocalDescription(answer);
        await pc1.setRemoteDescription(answer);

    } catch (error) {
        console.error('Error starting WebRTC:', error);
    }
}

function handleIceCandidate(pc, event) {
    const otherPc = pc === pc1 ? pc2 : pc1;
    if (event.candidate) {
        otherPc.addIceCandidate(event.candidate);
    }
}

function handleConnectionStateChange(pc) {
    if (pc.connectionState === 'connected') {
        console.log('WebRTC connection established');
    }
}

function gotRemoteStream(event) {
    const remoteStream = event.streams[0];
    remoteVideo.srcObject = remoteStream;
}

function hangup() {
    pc1.close();
    pc2.close();
    localVideo.srcObject = null;
    remoteVideo.srcObject = null;
    startButton.disabled = false;
    hangupButton.disabled = true;
}

