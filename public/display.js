const socket = new WebSocket(`ws://${window.location.host}`);

socket.onopen = () => {
    console.log('WebSocket connection established in display page');
};

socket.onerror = (error) => {
    console.error('WebSocket Error in display page: ', error);
};

socket.onclose = () => {
    console.log('WebSocket connection closed in display page');
};

// Handle incoming WebSocket messages
socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    console.log('Received data in display page:', data);

    if (data.type === 'update') {
        document.getElementById('team1-name').innerText = data.team1Name;
        document.getElementById('team2-name').innerText = data.team2Name;
        document.getElementById('team1-score').innerText = data.team1Score;
        document.getElementById('team2-score').innerText = data.team2Score;
        document.getElementById('timer').innerText = data.timer;
        document.getElementById('shotClockTimer').innerText = data.shotClockTimer;
    } else if (data.type === 'updateName') {
        if (data.team1Name) {
            document.getElementById('team1-name').innerText = data.team1Name;
        }
        if (data.team2Name) {
            document.getElementById('team2-name').innerText = data.team2Name;
        }
    }
});
