
// Variables for the scoring
let team1Score = 0;
let team2Score = 0;

//Variables for the names
let homeName = "Home";
let awayName = "Away";

// Update score every changes
function updateScore() {
    document.getElementById('team1-score').innerText = team1Score;
    document.getElementById('team2-score').innerText = team2Score;
}

// add team score by one point
function addPoint(team) {
    if (team === 1) {
        team1Score = team1Score + 1;
    } else if (team === 2) {
        team2Score = team2Score + 1;
    }
    updateScore();
}

// remove team score by one point
function removePoint(team) {
    if (team === 1) {
        team1Score = team1Score - 1;
    }
    else if (team === 2) {
        team2Score = team2Score - 1;
    }
    updateScore();
}

//Reset Scoreboard
function resetScore() {
    team1Score = 0;
    team2Score = 0;
    updateScore();
}


// Change team name
function updateTeamName(team) {
if (team === 1) {
    const newName = document.getElementById('home-name').value;
    if (newName) {
        homeName = newName;
        document.getElementById('team1-name').innerText = homeName;
    }
}
else if (team === 2) {
    const newName = document.getElementById('away-name').value;
    if (newName) {
        awayName = newName;
        document.getElementById('team2-name').innerText = awayName;
    }
}

}

//reset team name
function resetTeamName() {
    homeName = "Home";
    awayName = "Guest";
    document.getElementById('team1-name').innerText = homeName;
    document.getElementById('team2-name').innerText = awayName;
}


// Export Scoreboard
// You can now use ExcelJS directly without require
async function exportScoreboard() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Scoreboard');
    
   const header = worksheet.addRow(['Team', 'Score']);
    worksheet.addRow([homeName, team1Score]);
    worksheet.addRow([awayName, team2Score]);
    worksheet.addRow([,]);

    header.eachCell((cell => {
            cell.font = {bold: true};
        }));

    if (team1Score > team2Score) {
        const winnerCell = worksheet.addRow(['Winner!']);
        worksheet.addRow([homeName,team1Score]);

        winnerCell.eachCell((cell => {
            cell.font = {bold: true};
        }));
    }
    else if (team2Score > team1Score) {
        const winnerCell = worksheet.addRow(['Winner!']);
        worksheet.addRow([awayName, team2Score]);

        winnerCell.eachCell((cell => {
            cell.font = { bold: true};
        }));
    }
    else if (team1Score == team2Score) {
        const tieCell = worksheet.addRow(['Tie!'])
        tieCell.eachCell((cell => {
            cell.font = { bold: true};
        }));
    }


    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = homeName + '_' + awayName + '_scoreboard.xlsx';
    link.click();

    URL.revokeObjectURL(url);
}

