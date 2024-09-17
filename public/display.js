import Timer from './timer.js';
import ShotClock from './shot-clock.js';

const timerDisplay = document.getElementById('timerDisp');
const timer = new Timer(timerDisplay); // Create a timer instance

const shotClockDisplay = document.getElementById('shotClockDisp'); // This is the display element for the shot clock
const shotClock = new ShotClock(shotClockDisplay); // Create a shot clock instance

const socket = new WebSocket(`wss://${window.location.host}`);

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
    // Check if the data is a Blob
    if (event.data instanceof Blob) {
        const reader = new FileReader();
        
        reader.onload = function() {
            try {
                // Convert Blob to text
                const text = reader.result;
                console.log('Initial Text (Blob):', text);
                
                // Convert the text as JSON
                const data = JSON.parse(text);
                console.log('Parsed data:', data);

                // Handle the parsed data
                if (data.type == 'updateName1') {
                    document.getElementById('team1-name').innerText = data.team1Name;
                } 
                if (data.type == 'updateName2') {
                    document.getElementById('team2-name').innerText = data.team2Name;
                }
                if (data.type =='team1Point') {
                    document.getElementById('team1-score').innerText = data.team1Score;

                }
                if (data.type == 'team2Point') {
                    document.getElementById('team2-score').innerText = data.team2Score;
                }

                // timer
                if (data.type == 'start') {
                    timer.startTimer();
                }
                if (data.type =='pause') {
                    timer.pauseTimer();
                }
                if (data.type == 'reset') {
                    timer.resetTimer();
                }
                if (data.type == 'resume') {
                    timer.resumeTimer();
                }
                if (data.type == 'addMinute') {
                    timer.addMinute();
                }
                if (data.type == 'subtractMinute') {
                    timer.subtractMinute();
                }
                if (data.type == 'addSecond') {
                    timer.addSecond();
                }
                if (data.type == 'subtractSecond') {
                    timer.subtractSecond();
                }

                // shotclock
                if (data.type == 'startSC') {
                    shotClock.startSC();
                }
                if (data.type == 'pauseSC') {
                    shotClock.pauseSC();
                }
                if (data.type == 'resumeSC') {
                    shotClock.resumeSC();
                }
                if (data.type == 'resetTo24SC') {
                    shotClock.resetTo24SC();
                }
                if (data.type == 'resetTo14SC') {
                    shotClock.resetTo14SC();
                }
                if (data.type == 'addSecondSC') {
                    shotClock.addSecondSC();
                }
                if (data.type == 'subtractSecondSC') {
                    shotClock.subtractSecondSC();
                }
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };
        
        reader.readAsText(event.data);
    } else {
        // Handle other types of data
        console.error('Unexpected data type:', typeof event.data);
    }
});