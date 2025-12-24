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

function addMatchCard(status, team1Name, team2Name, team1Score = null, team2Score = null, matchTime = null) {
    if (status === "Live" && (!team1Name || !team2Name || team1Score === null || team2Score === null)) {
        console.log("Skipping empty live match card");
        return;  
    }
    const statusContainer = document.querySelector(`.${status.toLowerCase()}`);
    
    
    const matchCard = document.createElement('a');
    matchCard.classList.add('match-card');
    
    
    const matchStatus = document.createElement('div');
    matchStatus.classList.add('match-status', status.toLowerCase());
    matchStatus.textContent = status.toUpperCase();
    
    
    const teamsContainer = document.createElement('div');
    teamsContainer.classList.add('teams-container');
    
    const teamRow = document.createElement('div');
    teamRow.classList.add('team-row');
    
    
    const team1Info = document.createElement('div');
    team1Info.classList.add('team-info');
    const team1Logo = document.createElement('img');
    team1Logo.src = "../XTRAS/3541180.png";
    team1Logo.classList.add('team-logo-sm');
    const team1NameElem = document.createElement('span');
    team1NameElem.textContent = team1Name;
    team1Info.appendChild(team1Logo);
    team1Info.appendChild(team1NameElem);

    const vsText = document.createElement('div');
    vsText.classList.add('vs-text');
    vsText.textContent = "VS";

    const team2Info = document.createElement('div');
    team2Info.classList.add('team-info');
    const team2Logo = document.createElement('img');
    team2Logo.src = "../XTRAS/3541184.png"; 
    team2Logo.classList.add('team-logo-sm');
    const team2NameElem = document.createElement('span');
    team2NameElem.textContent = team2Name;
    team2Info.appendChild(team2Logo);
    team2Info.appendChild(team2NameElem);
    
    teamRow.appendChild(team1Info);
    teamRow.appendChild(vsText);
    teamRow.appendChild(team2Info);
    
    teamsContainer.appendChild(teamRow);
    
    matchCard.appendChild(matchStatus);
    matchCard.appendChild(teamsContainer);
    
    const matchTimeElem = document.createElement('div');
    matchTimeElem.classList.add('match-time');
    const scoreContainer = document.createElement('div');
    scoreContainer.classList.add('score-container');
    
    if (status === "Live") {
        matchStatus.classList.add('live', 'blinking');
        matchTimeElem.textContent = "Playing Now"; 
        const scoreDisplay = document.createElement('div');
        scoreDisplay.classList.add('score-display');
        scoreDisplay.textContent = `${team1Score} - ${team2Score}`; 
        scoreContainer.appendChild(scoreDisplay);
    } else if (status === "Upcoming") {
        matchTimeElem.textContent = matchTime;
    } else {
        matchTimeElem.textContent = "Full Time"; 
        const scoreDisplay = document.createElement('div');
        scoreDisplay.classList.add('score-display');
        scoreDisplay.textContent = `${team1Score} - ${team2Score}`; 
        scoreContainer.appendChild(scoreDisplay);
    }
    
    
    matchCard.appendChild(scoreContainer);
    matchCard.appendChild(matchTimeElem);
    
    
    statusContainer.appendChild(matchCard);
}


// addMatchCard("LIVE", "Manchester United", "Chelsea FC", 1, 0, "55' Playing Now");


// addMatchCard("UPCOMING", "Arsenal", "Tottenham Hotspur", null, null, "Sun 6:00 PM GMT");

// addMatchCard("COMPLETED", "Barcelona", "Bayern Munich", 2, 1, "Full Time");

async function getdata(){
    const dati = await fetch("http://localhost:8000/loadcardsf");
    const datai = await dati.json();
    console.log(datai)
    for(let i=0; i<datai.length; i++){
        addMatchCard(datai[i].status, datai[i].team1.name, datai[i].team2.name, datai[i].team1.score, datai[i].team2.score, "Full Time");
    }
}






