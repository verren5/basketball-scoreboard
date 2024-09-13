const socket = new WebSocket(`ws://${window.location.host}`);

socket.onopen = () => {
    console.log('WebSocket connection established');
};

socket.onerror = (error) => {
    console.error('WebSocket Error: ', error);
};

socket.onclose = () => {
    console.log('WebSocket connection closed');
};

socket.onmessage = function (event) {
    console.log("Data from server: ", event.data);
}

// Variables for the scoring
let team1Score = 0;
let team2Score = 0;

// Variables for the names
let homeName = "Home";
let awayName = "Guest";

// Update scoreboard display and send updates via WebSocket
function updateScoreboard() {
    const data = {
        type: 'update',
        team1Name: homeName,
        team2Name: awayName,
        team1Score: team1Score,
        team2Score: team2Score,
        timer: document.getElementById('timer').innerText,
        shotClockTimer: document.getElementById('shotClockTimer').innerText,
    };
    console.log('Sending update:', data);
    socket.send(JSON.stringify(data));
}

// Update score display and send score update via WebSocket
function updateScore() {
    document.getElementById('team1-score').innerText = team1Score;
    document.getElementById('team2-score').innerText = team2Score;

    const data = {
        type: 'update',
        team1Score: team1Score,
        team2Score: team2Score
    };
    console.log('Sending score update:', data);
    socket.send(JSON.stringify(data));
}

// Add point to team score
function addPoint(team) {
    if (team === 1) {
        team1Score += 1;
    } else if (team === 2) {
        team2Score += 1;
    }
    updateScore();
}

// Remove point from team score
function removePoint(team) {
    if (team === 1) {
        team1Score -= 1;
    } else if (team === 2) {
        team2Score -= 1;
    }
    updateScore();
}

// Reset scores
function resetScore() {
    team1Score = 0;
    team2Score = 0;
    updateScore();
}

// Update team names
function updateTeamName(team) {
    let displayName;
    if (team === 1) {
        displayName = document.getElementById('team1-name');
        const newName = document.getElementById('team1-name-input').value;
        if (newName) {
            homeName = newName;
            //check display name
            if(displayName) {
                displayName.innerText = homeName;
            } else {
                console.error("No display name")
            }
            socket.send(JSON.stringify({
                type: 'updateName1',
                team1Name: homeName
            }));
        }
    } else if (team === 2) {
        displayName = document.getElementById('team2-name');
        const newName = document.getElementById('team2-name-input').value;
        if (newName) {
            awayName = newName;
            //check display name
            if (displayName) {
                displayName.innerText = awayName;
            }else {
                console.error("No display name")
            }
            
            socket.send(JSON.stringify({
                type: 'updateName2',
                team2Name: awayName
            }));
        }
    }
}

// Reset team names
function resetTeamName() {
    homeName = "Home";
    awayName = "Guest";

    // Check if the team name have been updated
    let placeholderTeam1 = document.getElementById('team1-name-input').value;
    let placeholderTeam2 = document.getElementById('team2-name-input').value;

    if (placeholderTeam1) {
        placeholderTeam1 = homeName;
        socket.send(JSON.stringify({
            type: 'updateName1',
            team1Name: placeholderTeam1
        }));
    }
    if (placeholderTeam2) {
        placeholderTeam2 = awayName;
        socket.send(JSON.stringify({
            type: 'updateName2',
            team2Name: placeholderTeam2
        }));
    }
}

// Export scoreboard to Excel
async function exportScoreboard() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Scoreboard');
    
    const header = worksheet.addRow(['Team', 'Score']);
    worksheet.addRow([homeName, team1Score]);
    worksheet.addRow([awayName, team2Score]);

    header.eachCell(cell => {
        cell.font = { bold: true };
    });

    if (team1Score > team2Score) {
        const winnerCell = worksheet.addRow(['Winner!']);
        worksheet.addRow([homeName, team1Score]);

        winnerCell.eachCell(cell => {
            cell.font = { bold: true };
        });
    } else if (team2Score > team1Score) {
        const winnerCell = worksheet.addRow(['Winner!']);
        worksheet.addRow([awayName, team2Score]);

        winnerCell.eachCell(cell => {
            cell.font = { bold: true };
        });
    } else if (team1Score === team2Score) {
        const tieCell = worksheet.addRow(['Tie!']);
        tieCell.eachCell(cell => {
            cell.font = { bold: true };
        });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${homeName}_${awayName}_scoreboard.xlsx`;
    link.click();

    URL.revokeObjectURL(url);
}

// Event listeners for buttons
document.getElementById('add-team1-point').addEventListener('click', () => addPoint(1));
document.getElementById('subtract-team1-point').addEventListener('click', () => removePoint(1));
document.getElementById('add-team2-point').addEventListener('click', () => addPoint(2));
document.getElementById('subtract-team2-point').addEventListener('click', () => removePoint(2));
document.getElementById('update-team1-name').addEventListener('click', () => updateTeamName(1));
document.getElementById('update-team2-name').addEventListener('click', () => updateTeamName(2));
document.getElementById('resetTeamName').addEventListener('click', () => resetTeamName());
