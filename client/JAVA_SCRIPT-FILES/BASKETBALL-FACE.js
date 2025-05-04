document.querySelectorAll('.nav-button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

window.addEventListener("load", getdata());

document.querySelectorAll('.nav-button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

// This function will be responsible for adding match cards to the correct row based on their status.
function addMatchCard(status, team1Name, team2Name, team1Score = null, team2Score = null, matchTime = null) {
    // Get the container for the status category (live, upcoming, or completed)
    if (status === "Live" && (!team1Name || !team2Name || team1Score === null || team2Score === null)) {
        console.log("Skipping empty live match card");
        return;  // Prevent rendering the card
    }
    const statusContainer = document.querySelector(`.${status.toLowerCase()}`);
    
    // Create the match card element
    const matchCard = document.createElement('a');
    matchCard.classList.add('match-card');
    
    // Create the match status
    const matchStatus = document.createElement('div');
    matchStatus.classList.add('match-status', status.toLowerCase());
    matchStatus.textContent = status.toUpperCase();
    
    // Create the teams container
    const teamsContainer = document.createElement('div');
    teamsContainer.classList.add('teams-container');
    
    const teamRow = document.createElement('div');
    teamRow.classList.add('team-row');
    
    // Create team 1 info
    const team1Info = document.createElement('div');
    team1Info.classList.add('team-info');
    const team1Logo = document.createElement('img');
    team1Logo.src = "../XTRAS/3541180.png"; // Placeholder logo, update as needed
    team1Logo.classList.add('team-logo-sm');
    const team1NameElem = document.createElement('span');
    team1NameElem.textContent = team1Name;
    team1Info.appendChild(team1Logo);
    team1Info.appendChild(team1NameElem);

    // Create VS text for match
    const vsText = document.createElement('div');
    vsText.classList.add('vs-text');
    vsText.textContent = "VS";
    
    // Create team 2 info
    const team2Info = document.createElement('div');
    team2Info.classList.add('team-info');
    const team2Logo = document.createElement('img');
    team2Logo.src = "../XTRAS/3541184.png"; // Placeholder logo, update as needed
    team2Logo.classList.add('team-logo-sm');
    const team2NameElem = document.createElement('span');
    team2NameElem.textContent = team2Name;
    team2Info.appendChild(team2Logo);
    team2Info.appendChild(team2NameElem);
    
    // Add team information to the row
    teamRow.appendChild(team1Info);
    teamRow.appendChild(vsText);
    teamRow.appendChild(team2Info);
    
    // Add the team row to the teams container
    teamsContainer.appendChild(teamRow);
    
    // Add the match status and teams container to the match card
    matchCard.appendChild(matchStatus);
    matchCard.appendChild(teamsContainer);
    
    // Create the match time element and score display
    const matchTimeElem = document.createElement('div');
    matchTimeElem.classList.add('match-time');
    const scoreContainer = document.createElement('div');
    scoreContainer.classList.add('score-container');
    
    if (status === "Live") {
        matchStatus.classList.add('live', 'blinking');
        matchTimeElem.textContent = "Playing Now"; // For live matches
        const scoreDisplay = document.createElement('div');
        scoreDisplay.classList.add('score-display');
        scoreDisplay.textContent = `${team1Score} - ${team2Score}`; // Display live score
        scoreContainer.appendChild(scoreDisplay);
    } else if (status === "Upcoming") {
        matchTimeElem.textContent = matchTime; // Show match time for upcoming matches
    } else {
        matchTimeElem.textContent = "Full Time"; // Completed matches
        const scoreDisplay = document.createElement('div');
        scoreDisplay.classList.add('score-display');
        scoreDisplay.textContent = `${team1Score} - ${team2Score}`; // Display score for completed matches
        scoreContainer.appendChild(scoreDisplay);
    }
    
    // Add score container and match time element to the match card
    matchCard.appendChild(scoreContainer);
    matchCard.appendChild(matchTimeElem);
    
    // Append the match card to the correct status section (Live, Upcoming, or Completed)
    statusContainer.appendChild(matchCard);
}

// // Example usage: Add a new live match dynamically with score
// addMatchCard("LIVE", "Manchester United", "Chelsea FC", 1, 0, "55' Playing Now");

// // Example usage: Add an upcoming match dynamically
// addMatchCard("UPCOMING", "Arsenal", "Tottenham Hotspur", null, null, "Sun 6:00 PM GMT");

// // Example usage: Add a completed match dynamically with score
// addMatchCard("COMPLETED", "Barcelona", "Bayern Munich", 2, 1, "Full Time");

async function getdata(){
    const dati = await fetch("http://localhost:8000/loadcardsb");
    const datai = await dati.json();
    console.log(datai)
    for(let i=0; i<datai.length; i++){
        addMatchCard(datai[i].status, datai[i].team1.name, datai[i].team2.name, datai[i].team1.score, datai[i].team2.score, "Full Time");
    }
}