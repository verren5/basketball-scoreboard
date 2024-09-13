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