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
/*
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
*/

// Add point to team score
function addPoint(team) {
    let displayScore;
    if (team === 1) {
        displayScore = document.getElementById('team1-score');
        team1Score += 1;
            socket.send(JSON.stringify({
                type: 'team1Point',
                team1Score
            }));
        }
    if (team === 2) {
        displayScore = document.getElementById('team2-score');
        team2Score += 1;
            socket.send(JSON.stringify({
                type: 'team2Point',
                team2Score
            }));
        }
}

// Remove point from team score
function removePoint(team) {
    let displayScore;
    if (team === 1) {
        displayScore = document.getElementById('team1-score');
        team1Score -= 1;
            socket.send(JSON.stringify({
                type: 'team1Point',
                team1Score
            }));
        }
    if (team === 2) {
        displayScore = document.getElementById('team2-score');
        team2Score -= 1;
            socket.send(JSON.stringify({
                type: 'team2Point',
                team2Score
            }));
        }
}

// Reset scores
function resetScore() {
    team1Score = 0;
    team2Score = 0;
    socket.send(JSON.stringify({
        type: 'team1Point',
        team1Score
    }));
    
    socket.send(JSON.stringify({
        type: 'team2Point',
        team2Score
    }));
    
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

let isFirstTime = true
let timersRunning = false;
// Event listener for the toggle button
document.getElementById('toggleBothButton').addEventListener('click', () => {
    if (isFirstTime && !timersRunning) {
        socket.send(JSON.stringify({ type: 'startBoth' }));
        timersRunning = true;
        isFirstTime = false;
    } else if (!isFirstTime && !timersRunning) {
        socket.send(JSON.stringify({ type: 'resumeBoth' }));
        timersRunning = true;
    } else {
        socket.send(JSON.stringify({ type: 'pauseBoth' }));
        timersRunning = false;
    }
}); 

// let shotclocksRunning = false;
// document.getElementById('toggleBothButton').addEventListener('click', () => {
//     if (!shotclocksRunning) {
//         socket.send(JSON.stringify({ type: 'startSC' }));
//         shotclocksRunning = true;
//     } else {
//         socket.send(JSON.stringify({ type: 'pauseSC' }));
//         shotclocksRunning = false;
//     }
// }); 


// Event listeners for buttons
document.getElementById('add-team1-point').addEventListener('click', () => addPoint(1));
document.getElementById('subtract-team1-point').addEventListener('click', () => removePoint(1));
document.getElementById('add-team2-point').addEventListener('click', () => addPoint(2));
document.getElementById('subtract-team2-point').addEventListener('click', () => removePoint(2));
document.getElementById('update-team1-name').addEventListener('click', () => updateTeamName(1));
document.getElementById('update-team2-name').addEventListener('click', () => updateTeamName(2));
document.getElementById('resetTeamName').addEventListener('click', () => resetTeamName());
document.getElementById('resetScore').addEventListener('click', () => resetScore());
document.getElementById('exportScoreboard').addEventListener('click', () =>exportScoreboard());

//timer and shotclock
// document.getElementById('startBothButton').addEventListener('click', () => {
//     socket.send(JSON.stringify({ type: 'startBoth' }));
// });
// document.getElementById('pauseBothButton').addEventListener('click', () => {
//     socket.send(JSON.stringify({ type: 'pauseBoth' }));
// });
// document.getElementById('resumeBothButton').addEventListener('click', () => {
//     socket.send(JSON.stringify({ type: 'resumeBoth' }));
// });
document.getElementById('startResetBothButtonTo24').addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'startResetBothTo24' }));
});
document.getElementById('startResetBothButtonTo14').addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'startResetBothTo14' }));
});
document.getElementById('startResetBothButtonTo12').addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'startResetBothTo12' }));
});

//timer
document.getElementById('startButton').addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'start' })); 
});

document.getElementById('pauseButton').addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'pause' })); 
});

document.getElementById('resetButton').addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'reset' })); 
});

document.getElementById('resumeButton').addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'resume' })); 
});
document.getElementById('addMinute').addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'addMinute' })); 
});
document.getElementById('addSecond').addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'addSecond' })); 
});
document.getElementById('subtractMinute').addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'subtractMinute' })); 
});
document.getElementById('subtractSecond').addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'subtractSecond' })); 
});

// shotclock
document.getElementById('startSC').addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'startSC' }));
});

document.getElementById('pauseSC').addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'pauseSC' })); 
});

document.getElementById('resumeSC').addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'resumeSC' })); 
});

document.getElementById('resetTo24SC').addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'resetTo24SC' })); 
});

document.getElementById('resetTo14SC').addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'resetTo14SC' })); 
});

document.getElementById('resetTo12SC').addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'resetTo12SC' })); 
});

document.getElementById('addSecondSC').addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'addSecondSC' })); 
});

document.getElementById('subtractSecondSC').addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'subtractSecondSC' })); 
});