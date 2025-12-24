document.addEventListener("DOMContentLoaded", function (e) {
  e.preventDefault();
  let teams1 = 0;
  let teams2 = 0;
  let team1 = [];
  let team2 = [];
  const team1p = [];
  const team2p = [];

  async function matchtoload() {
    const resp = await fetch("http://localhost:8000/cur-match-f");
    const teamsdata = await resp.json();
    teams1 = teamsdata[0];
    teams2 = teamsdata[1];

    for (let i = 0; i < teams1.players.length; i++) {
      team1p.push({ number: i + 1, name: teams1.players[i].name, actions: [] });
    }
    for (let y = 0; y < teams2.players.length; y++) {
      team2p.push({ number: y + 1, name: teams2.players[y].name, actions: [] });
    }

    team1 = {
      name: teams1.teamname,
      players: team1p,
      score: 0,
    };

    team2 = {
      name: teams2.teamname,
      players: team2p,
      score: 0,
    };

    inf(teamsdata[2]);
  }

  matchtoload();

  function inf(x) {
    const team1Element = document.getElementById("team1-players");
    const team2Element = document.getElementById("team2-players");
    const team1ScoreElement = document.querySelector("#team1-score .score");
    const team2ScoreElement = document.querySelector("#team2-score .score");
    const modal = document.getElementById("action-modal");
    const playerNameElement = document.getElementById("player-name");
    const closeBtn = document.querySelector(".close-btn");
    const actionButtons = document.querySelectorAll(".action-btn");
    const eventsLog = document.getElementById("events-log");

    let selectedPlayer = null;
    let selectedTeam = null;

    const startGameBtn = document.getElementById("start-game");
    const endGameBtn = document.getElementById("end-game");
    const gameStatus = document.getElementById("game-status");

    function sendScoreUpdate(teamName, player, teamScore) {
        const data = {
          team: teamName,
          playerNumber: player.number,
          playerName: player.name,
          newScore: teamScore,
          sportName: "Football",
          matchid: x
        };
      
        fetch("http://localhost:8000/score-update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(result => {
          console.log("Score update sent:", result);
        })
        .catch(err => {
          console.error("Error sending score update:", err);
        });
      }



    startGameBtn.addEventListener("click", () => {
      gameStatus.textContent = "Status: Live";
      const dat = {
        gameStatus: "Live", 
        sportName: "Football", 
        matchid: x,
      };
      
      fetch('http://localhost:8000/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dat)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); 
      })
      .then(result => {
        console.log('Server response:', result);
      })
      .catch(error => {
        console.error('Error:', error);
      });
      startGameBtn.disabled = true;
      endGameBtn.disabled = false;
      
    });

    endGameBtn.addEventListener("click", () => {
      gameStatus.textContent = "Status: Ended";
      const dat = {
        gameStatus: "Completed", 
        sportName: "Football",
        matchid: x,  
      };
      
      fetch('http://localhost:8000/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dat)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); 
      })
      .then(result => {
        console.log('Server response:', result);
      })
      .catch(error => {
        console.error('Error:', error);
      });
      endGameBtn.disabled = true;
      startGameBtn.disabled = false;
      
    });

    
    function renderPlayers() {
      team1Element.innerHTML = "";
      team2Element.innerHTML = "";

      team1.players.forEach((player) => {
        const playerRow = createPlayerRow(player, team1);
        team1Element.appendChild(playerRow);
      });

      team2.players.forEach((player) => {
        const playerRow = createPlayerRow(player, team2);
        team2Element.appendChild(playerRow);
      });
    }

    
    function createPlayerRow(player, team) {
      const row = document.createElement("tr");

      const numberCell = document.createElement("td");
      numberCell.textContent = player.number;
      row.appendChild(numberCell);

      const nameCell = document.createElement("td");
      nameCell.textContent = player.name;
      row.appendChild(nameCell);

      const actionsCell = document.createElement("td");
      actionsCell.className = "player-actions";

      player.actions.forEach((action) => {
        const badge = document.createElement("span");
        badge.className = `action-badge ${action.type}`;
        badge.textContent =
          action.type.charAt(0).toUpperCase() + action.type.slice(1);
        if (action.type === "yellow") badge.textContent = "Yellow";
        if (action.type === "red") badge.textContent = "Red";
        actionsCell.appendChild(badge);
      });

      row.appendChild(actionsCell);

      const buttonCell = document.createElement("td");
      const button = document.createElement("button");
      button.className = "action-btn-table";
      button.textContent = "Add Action";
      button.addEventListener("click", () => openModal(player, team));
      buttonCell.appendChild(button);
      row.appendChild(buttonCell);

      return row;
    }

    function openModal(player, team) {
      selectedPlayer = player;
      selectedTeam = team;
      playerNameElement.textContent = `${team.name} - ${player.number} ${player.name}`;
      modal.style.display = "flex";
    }

    function closeModal() {
      modal.style.display = "none";
      selectedPlayer = null;
      selectedTeam = null;
    }

    function addEventToLog(eventText) {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const eventItem = document.createElement("div");
      eventItem.className = "event-item";
      eventItem.textContent = `[${timeString}] ${eventText}`;
      eventsLog.appendChild(eventItem);

      eventsLog.scrollTop = eventsLog.scrollHeight;
    }

    function handleAction(action) {
      if (!selectedPlayer || !selectedTeam) return;

      const actionText = `${selectedTeam.name} - Player ${selectedPlayer.number} ${selectedPlayer.name}`;

      switch (action) {
        case "goal":
          selectedTeam.score++;
          selectedPlayer.actions.push({ type: "goal", time: new Date() });
          addEventToLog(`${actionText} scored a goal!`);
          sendScoreUpdate(selectedTeam.name, selectedPlayer, selectedTeam.score);
          break;
        case "foul":
          selectedPlayer.actions.push({ type: "foul", time: new Date() });
          addEventToLog(`${actionText} committed a foul`);
          break;
        case "yellow":
          selectedPlayer.actions.push({ type: "yellow", time: new Date() });
          addEventToLog(`${actionText} received a yellow card`);
          break;
        case "red":
          selectedPlayer.actions.push({ type: "red", time: new Date() });
          addEventToLog(`${actionText} received a red card`);
          break;
      }

      updateScores();
      renderPlayers();
      closeModal();
    }

    function updateScores() {
      team1ScoreElement.textContent = team1.score;
      team2ScoreElement.textContent = team2.score;
    }

    closeBtn.addEventListener("click", closeModal);
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    actionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.getAttribute("data-action");
        handleAction(action);
      });
    });

    renderPlayers();
    updateScores();

    document.querySelector("#team1-score h2").textContent = team1.name;
    document.querySelector("#team2-score h2").textContent = team2.name;

    addEventToLog("Match started!");
  }

});
