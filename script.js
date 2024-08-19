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

// Export Scoreboard
function exportScoreboard() {

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
    homeName = "home";
    awayName = "away";
    document.getElementById('team1-name').innerText = homeName;
    document.getElementById('team2-name').innerText = awayName;
}

