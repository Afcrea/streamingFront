const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');

let localStream;
let remoteStream;
let screenStream; // 스크린 공유 스트림

// Get user media (camera and microphone)
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        localVideo.srcObject = stream;
        localStream = stream;
    })
    .catch(error => {
        console.error('Error accessing media devices:', error);
    });

// Create a Peer Connection
const peerConnection = new RTCPeerConnection();

// Add local stream to Peer Connection
localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
});

// Handle incoming stream from another user
peerConnection.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
    remoteStream = event.streams[0];
};

// Start screen sharing
startButton.addEventListener('click', () => {
    navigator.mediaDevices.getDisplayMedia({ video: true })
        .then(stream => {
            screenStream = stream;
            peerConnection.getSenders().forEach(sender => {
                sender.replaceTrack(screenStream.getTracks()[0]);
            });
        })
        .catch(error => {
            console.error('Error accessing screen sharing:', error);
        });
});

// Stop screen sharing
stopButton.addEventListener('click', () => {
    screenStream.getTracks().forEach(track => track.stop());
    peerConnection.getSenders().forEach(sender => {
        sender.replaceTrack(localStream.getTracks()[0]);
    });
});

// ...
