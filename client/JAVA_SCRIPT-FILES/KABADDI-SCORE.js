document.addEventListener('DOMContentLoaded', function (e) {
    e.preventDefault();
    let teams1 = 0;
    let teams2 = 0;
    let team1 = 0;
    let team2 = 0;
    const team1p = [];
    const team2p = [];

    async function matchtoload(){
        const resp = await fetch('http://localhost:8000/cur-match-k');
        const teamsdata = await resp.json();
        teams1 = teamsdata[0];
        teams2 = teamsdata[1];
        console.log(teams1);
        
        for(let i=0; i < teams1.players.length; i++){
            team1p.push({number:i+1, name: teams1.players[i].name, position: teams1.players[i].role, stats: []});
        }
        for(let y=0; y < teams2.players.length; y++){
            team2p.push({number:y+1, name: teams2.players[y].name, position: teams2.players[y].role, stats: []});
        }
        team1 = {      
            name: teams1.teamname,
            players: team1p,
            score: 0,
            timeouts: 5
        };
        team2 = {
            name: teams2.teamname,
            players: team2p,
            score: 0,
            timeouts: 5     
        };
        
        infg(teamsdata[2]);
    }
    matchtoload()

    function infg(x){
        let gameState = {
            currentHalf: 1,
            isMatchStarted: false,
            isTimerRunning: false,
            timeRemaining: 1200,
            timerInterval: null,
            lastUpdateTime: null,
            matchStartTime: null,
            currentRaider: null,     
            raidInProgress: false,   
            raidOutcome: null,
            raidActions: [],
            currentRaidTeam: 'team1',
            raidStartTime: null,      
            raidTimeout: 30, 
            raidTimeoutId: null,
        };
        const team1Element = document.getElementById('team1-players');
        const team2Element = document.getElementById('team2-players');
        const team1ScoreElement = document.querySelector('#team1-score .score');
        const team2ScoreElement = document.querySelector('#team2-score .score');
        const team1NameElement = document.querySelector('#team1-score h2');
        const team2NameElement = document.querySelector('#team2-score h2');
        const modal = document.getElementById('action-modal');
        const playerNameElement = document.getElementById('player-name');
        const closeBtn = document.querySelector('.close-btn');
        const actionButtons = document.querySelectorAll('.action-btn');
        const eventsLog = document.getElementById('events-log');
        const gameTimerElement = document.getElementById('game-timer');
        const startGameBtn = document.getElementById('start-game');
        const endHalfBtn = document.getElementById('end-half');
        const timeoutBtn = document.getElementById('timeout');
        const allOutBtn = document.getElementById('all-out');
        const startTimerBtn = document.getElementById('start-timer');
        const pauseTimerBtn = document.getElementById('pause-timer');
        const resetTimerBtn = document.getElementById('reset-timer');
        const currentHalfElement = document.getElementById('current-half');
        const timeoutsLeftElement = document.getElementById('timeouts-left');
    
        let selectedPlayer = null;
        let selectedTeam = null;
        

        function sendScoreToServer(team, pointsScored) {
            const matchId = x;  
        
            const data = {
                matchId: matchId,
                teamName: team.name,
                pointsScored: pointsScored,
                gameStatus: gameState.isMatchStarted ? "Live" : "Completed",
                sportName: "Kabaddi", 
            };
        
            fetch('http://localhost:8000/score-update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();  
            })
            .then(result => {
                console.log('Score sent successfully:', result); 
            })
            .catch(error => {
                console.error('Error sending score:', error);  
            });
        }


        function renderPlayers() {
            team1Element.innerHTML = '';
            team2Element.innerHTML = '';
    
            team1.players.forEach(player => {
                const playerRow = createPlayerRow(player, team1);
                team1Element.appendChild(playerRow);
            });
    
            team2.players.forEach(player => {
                const playerRow = createPlayerRow(player, team2);
                team2Element.appendChild(playerRow);
            });
    
            updatePlayerActionButtons();
        }
    
        function createPlayerRow(player, team) {
            const row = document.createElement('tr');
    
            const numberCell = document.createElement('td');
            numberCell.textContent = player.number;
            row.appendChild(numberCell);
    
            const nameCell = document.createElement('td');
            nameCell.textContent = player.name;
            row.appendChild(nameCell);
    
            const positionCell = document.createElement('td');
            positionCell.textContent = player.position;
            row.appendChild(positionCell);
    
            const statsCell = document.createElement('td');
            statsCell.className = 'player-stats';
    
            const statsCount = {};
            player.stats.forEach(stat => {
                statsCount[stat.type] = (statsCount[stat.type] || 0) + 1;
            });
    
            for (const statType in statsCount) {
                const badge = document.createElement('span');
                badge.className = `stat-badge ${statType}`;
    
                let icon = '';
                let displayText = '';
    
                switch (statType) {
                    case 'raid':
                        icon = '<i class="fas fa-running"></i>';
                        displayText = `${statsCount[statType]}R`;
                        break;
                    case 'touch':
                        icon = '<i class="fas fa-hand-paper"></i>';
                        displayText = `${statsCount[statType]}T`;
                        break;
                    case 'tackle':
                        icon = '<i class="fas fa-people-arrows"></i>';
                        displayText = `${statsCount[statType]}TK`;
                        break;
                    case 'bonus':
                        icon = '<i class="fas fa-star"></i>';
                        displayText = `${statsCount[statType]}B`;
                        break;
                    case 'point':
                        icon = '<i class="fas fa-plus"></i>';
                        displayText = `${statsCount[statType]}P`;
                        break;
                }
    
                badge.innerHTML = `${icon} ${displayText}`;
                statsCell.appendChild(badge);
            }
    
            row.appendChild(statsCell);
    
            const buttonCell = document.createElement('td');
            const button = document.createElement('button');
            button.className = 'action-btn-table';
            button.innerHTML = '<i class="fas fa-plus-circle"></i> Add Action';
            button.addEventListener('click', () => openModal(player, team));
            button.disabled = !gameState.isMatchStarted;
            buttonCell.appendChild(button);
            row.appendChild(buttonCell);
    
            return row;
        }
    
        function updatePlayerActionButtons() {
            const buttons = document.querySelectorAll('.action-btn-table');
            buttons.forEach(button => {
                button.disabled = !gameState.isMatchStarted;
            });
        }
    
        function openModal(player, team) {
            if (!gameState.isMatchStarted) return;
    
            selectedPlayer = player;
            selectedTeam = team;
            playerNameElement.innerHTML = `<i class="fas fa-user"></i> ${team.name} - #${player.number} ${player.name} (${player.position})`;
            modal.style.display = 'flex';
        }
    
        function closeModal() {
            modal.style.display = 'none';
            selectedPlayer = null;
            selectedTeam = null;
        }
    
        function addEventToLog(eventText) {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
            const eventItem = document.createElement('div');
            eventItem.className = 'event-item';
    
            let icon = '';
            if (eventText.includes('raid')) icon = '<i class="fas fa-running"></i>';
            else if (eventText.includes('touch')) icon = '<i class="fas fa-hand-paper"></i>';
            else if (eventText.includes('tackle')) icon = '<i class="fas fa-people-arrows"></i>';
            else if (eventText.includes('bonus')) icon = '<i class="fas fa-star"></i>';
            else if (eventText.includes('point')) icon = '<i class="fas fa-plus"></i>';
            else if (eventText.includes('All Out')) icon = '<i class="fas fa-users-slash"></i>';
            else if (eventText.includes('Timeout')) icon = '<i class="fas fa-clock"></i>';
            else if (eventText.includes('started')) icon = '<i class="fas fa-play"></i>';
            else if (eventText.includes('ended')) icon = '<i class="fas fa-flag-checkered"></i>';
    
            if (gameState.isMatchStarted) {
                eventItem.innerHTML = `${icon} [H${gameState.currentHalf} ${timeString}] ${eventText}`;
            } else {
                eventItem.innerHTML = `${icon} [Match not started] ${eventText}`;
            }
            eventsLog.appendChild(eventItem);
            eventsLog.scrollTop = eventsLog.scrollHeight;
        }
    
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = (seconds % 60).toFixed(0);
            return {mins, secs};
        }
    
        function formatTimeForDisplay(seconds) {
            const { mins, secs } = formatTime(seconds);
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    
        function updateTimerDisplay() {
            gameTimerElement.textContent = formatTimeForDisplay(gameState.timeRemaining);
        }
    
        function handleActionForPlayer(action, player, team) {
            selectedPlayer = player;
            selectedTeam = team;
            handleAction(action);
            selectedPlayer = null;
            selectedTeam = null;
        }
    
        function handleAction(action) {
            if (!selectedPlayer || !selectedTeam || !gameState.isMatchStarted) return;
    
            const actionText = `${selectedTeam.name} - #${selectedPlayer.number} ${selectedPlayer.name}`;
    
            switch (action) {
                case 'raid':
                    if (gameState.raidInProgress) {
                        alert('Another raid is already in progress!');
                        return;
                    }
                    if ((selectedTeam === team1 && gameState.currentRaidTeam !== 'team1') ||
                        (selectedTeam === team2 && gameState.currentRaidTeam !== 'team2')) {
                        alert(`It's ${gameState.currentRaidTeam === 'team1' ? team1.name : team2.name}'s turn to raid!`);
                        return;
                    }
    
                    gameState.raidActions = [];
                    gameState.raidPoints = 0;
    
                    gameState.currentRaider = {
                        player: selectedPlayer,
                        team: selectedTeam
                    };
                    gameState.raidInProgress = true;
                    gameState.raidStartTime = Date.now();
    
                    selectedPlayer.stats.push({
                        type: 'raid',
                        timestamp: gameState.raidStartTime,
                        time: gameState.timeRemaining
                    });
    
                    addEventToLog(`${actionText} started a raid`);
                    disableAllActionsExceptRaidActions(selectedPlayer, selectedTeam);
    
                    if (gameState.raidTimeoutId) {
                        clearTimeout(gameState.raidTimeoutId);
                    }
                    gameState.raidTimeoutId = setTimeout(() => {
                        if (gameState.raidInProgress) {
                            addEventToLog(`${actionText}'s raid timed out!`);
                            handleRaidEnd(false);
                        }
                    }, gameState.raidTimeout * 1000);
                    break;
                case 'tackle':
                    if (!gameState.raidInProgress) {
                        alert('No raid in progress to tackle!');
                        return;
                    }
                    if (selectedTeam === gameState.currentRaider.team) {
                        alert("You can't tackle your own player!");
                        return;
                    }
    
                    if (gameState.raidActions.some(a => a.type === 'tackle')) {
                        alert('A tackle has already been attempted this raid!');
                        return;
                    }
    
                    gameState.raidActions.push({ type: 'tackle', player: selectedPlayer });
                    selectedPlayer.stats.push({
                        type: 'tackle',
                        timestamp: new Date().getTime(),
                        time: gameState.timeRemaining
                    });
                    addEventToLog(`${actionText} attempted a tackle`);
                    break;
                case 'touch':
                    if (!gameState.raidInProgress || selectedTeam !== gameState.currentRaider.team) {
                        alert('Not in a raid or not your raid turn!');
                        return;
                    }
                    selectedPlayer.stats.push({
                        type: 'touch',
                        timestamp: new Date().getTime(),
                        time: gameState.timeRemaining
                    });
                    addEventToLog(`${actionText} made a touch`);
                    break;
    
                case 'bonus':
                    if (!gameState.raidInProgress || selectedTeam !== gameState.currentRaider.team) {
                        alert('Not in a raid or not your raid turn!');
                        return;
                    }
                    selectedPlayer.stats.push({
                        type: 'bonus',
                        timestamp: new Date().getTime(),
                        time: gameState.timeRemaining
                    });
                    addEventToLog(`${actionText} earned a bonus`);
                    break;
    
                case 'point':
                    if (!gameState.raidInProgress || selectedTeam !== gameState.currentRaider.team) {
                        alert('Not in a raid or not your raid turn!');
                        return;
                    }
                    addEventToLog(`${actionText} ended the raid`);
                    handleRaidEnd(true);
                    break;
            }
    
            renderPlayers();
            closeModal();
        }
        function enableAllActionsAfterRaid() {
            const actionButtons = document.querySelectorAll('.action-btn-table');
            actionButtons.forEach(btn => {
                const row = btn.closest('tr');
                const playerNumber = row.cells[0].textContent;
                const teamName = row.closest('tbody').id === 'team1-players' ? team1 : team2;
    
                btn.disabled = !gameState.isMatchStarted ||
                    (teamName !== (gameState.currentRaidTeam === 'team1' ? team1 : team2));
    
                btn.innerHTML = '<i class="fas fa-plus-circle"></i> Add Action';
                btn.onclick = function () {
                    const player = teamName.players.find(p => p.number == playerNumber);
                    openModal(player, teamName);
                };
            });
    
            const modalActions = document.querySelectorAll('.action-btn');
            modalActions.forEach(btn => {
                btn.style.display = 'flex';
            });
    
            endHalfBtn.disabled = !gameState.isMatchStarted;
            timeoutBtn.disabled = !gameState.isMatchStarted;
            allOutBtn.disabled = !gameState.isMatchStarted;
        }
    
        function disableAllActionsExceptRaidActions(raider, team) {
            const actionButtons = document.querySelectorAll('.action-btn-table');
            actionButtons.forEach(btn => {
                const row = btn.closest('tr');
                const playerNumber = row.cells[0].textContent;
                const teamName = row.closest('tbody').id === 'team1-players' ? team1 : team2;
    
                if (teamName === team) {
                    if (playerNumber == raider.number) {
                        btn.disabled = false;
                        btn.innerHTML = '<i class="fas fa-plus-circle"></i> Raid Actions';
                        btn.onclick = () => {
                            const player = team.players.find(p => p.number == playerNumber);
                            openRaidActionsModal(player, team);
                        };
                    } else {
                        btn.disabled = true;
                    }
                } else {
                    const isDefender = row.cells[2].textContent === 'Defender';
                    btn.disabled = !isDefender;
                    if (isDefender) {
                        btn.innerHTML = '<i class="fas fa-people-arrows"></i> Tackle';
                        btn.onclick = () => {
                            const player = teamName.players.find(p => p.number == playerNumber);
                            handleActionForPlayer('tackle', player, teamName);
                        };
                    }
                }
            });
    
            endHalfBtn.disabled = true;
            timeoutBtn.disabled = true;
            allOutBtn.disabled = true;
        }
        function openRaidActionsModal(player, team) {
            if (!gameState.isMatchStarted || !gameState.raidInProgress) return;
    
            selectedPlayer = player;
            selectedTeam = team;
            playerNameElement.innerHTML = `<i class="fas fa-user"></i> ${team.name} - #${player.number} ${player.name} (Raid Actions)`;
    
            document.querySelector('[data-action="raid"]').style.display = 'none';
            document.querySelector('[data-action="tackle"]').style.display = 'none';
            document.querySelector('[data-action="touch"]').style.display = 'block';
            document.querySelector('[data-action="bonus"]').style.display = 'block';
            document.querySelector('[data-action="point"]').style.display = 'block';
    
            modal.style.display = 'flex';
        }
        function handlePlayerReturn(returnedSuccessfully) {
            if (gameState.raidTimeoutId) {
                clearTimeout(gameState.raidTimeoutId);
                gameState.raidTimeoutId = null;
            }
            if (!gameState.raidInProgress || !gameState.currentRaider) return;
    
            const { player, team } = gameState.currentRaider;
            const opponent = team === team1 ? team2 : team1;
    
            if (returnedSuccessfully) {
                const touches = player.stats.filter(s =>
                    s.type === 'touch' && s.timestamp >= gameState.raidStartTime
                ).length;
    
                const bonus = player.stats.some(s =>
                    s.type === 'bonus' && s.timestamp >= gameState.raidStartTime
                );
    
                if (touches > 0) {
                    team.score += touches;
                    sendScoreToServer(team, touches);
                    addEventToLog(`${team.name} scored ${touches} point(s) from raid touches`);
                }
    
                if (bonus) {
                    team.score += 1;
                    sendScoreToServer(team, 1); 
                    addEventToLog(`${team.name} scored 1 bonus point`);
                }
            } else {
                opponent.score += 1;
                sendScoreToServer(opponent, 1);
                addEventToLog(`${opponent.name} scored 1 point for successful tackle`);
            }
    
            gameState.currentRaidTeam = gameState.currentRaidTeam === 'team1' ? 'team2' : 'team1';
            gameState.raidInProgress = false;
            gameState.currentRaider = null;
            gameState.raidStartTime = null;
    
            updateScores();
            renderPlayers();
            addEventToLog(`Next raid turn: ${gameState.currentRaidTeam === 'team1' ? team1.name : team2.name}`);
            enableAllActionsAfterRaid();
        }
        function handleRaidEnd(successful) {
            if (!gameState.raidInProgress) return;
    
            if (gameState.raidTimeoutId) {
                clearTimeout(gameState.raidTimeoutId);
                gameState.raidTimeoutId = null;
            }
    
            const { player, team } = gameState.currentRaider;
            const opponent = team === team1 ? team2 : team1;
    
            if (!successful) {
                opponent.score += 1;
                sendScoreToServer(opponent, 1);
                addEventToLog(`${opponent.name} gets 1 point for successful tackle`);
            } else {
                const touches = player.stats.filter(s =>
                    s.type === 'touch' && s.timestamp >= gameState.raidStartTime
                ).length;
    
                const hasBonus = player.stats.some(s =>
                    s.type === 'bonus' && s.timestamp >= gameState.raidStartTime
                );
    
                const totalPoints = touches + (hasBonus ? 1 : 0);
    
                if (totalPoints > 0) {
                    team.score += totalPoints;
                    sendScoreToServer(team, totalPoints);
                    addEventToLog(`${team.name} scored ${totalPoints} point(s) from raid`);
                } else {
                    addEventToLog(`Raid ended with no points scored`);
                }
            }
    
            gameState.currentRaidTeam = gameState.currentRaidTeam === 'team1' ? 'team2' : 'team1';
            gameState.raidInProgress = false;
            gameState.currentRaider = null;
            gameState.raidStartTime = null;
            gameState.raidPoints = 0;
            gameState.raidActions = [];
    
            updateScores();
            renderPlayers();
            addEventToLog(`Next raid turn: ${gameState.currentRaidTeam === 'team1' ? team1.name : team2.name}`);
            enableAllActionsAfterRaid();
        }
    
        function updateScores() {
            team1ScoreElement.textContent = team1.score;
            team2ScoreElement.textContent = team2.score;
        }
    
        function startMatch() {
            if (gameState.isMatchStarted) return;
            const dat = {
                gameStatus: "Live", 
                sportName: "Kabaddi", 
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
    
            gameState.isMatchStarted = true;
            gameState.timeRemaining = 1200;
            gameState.currentHalf = 1;
            gameState.matchStartTime = new Date();
    
            startGameBtn.innerHTML = '<i class="fas fa-check"></i> Match Started';
            startGameBtn.disabled = true;
            endHalfBtn.disabled = false;
            timeoutBtn.disabled = false;
            allOutBtn.disabled = false;
            startTimerBtn.disabled = false;
    
            updatePlayerActionButtons();
    
            addEventToLog('Match started! First half begins.');
            updateTimerDisplay();
            currentHalfElement.textContent = gameState.currentHalf;
        }
        function disableAllActionsExceptReturn(raider, team) {
            const actionButtons = document.querySelectorAll('.action-btn-table');
            actionButtons.forEach(btn => {
                const row = btn.closest('tr');
                const playerNumber = row.cells[0].textContent;
                const teamName = row.closest('tbody').id === 'team1-players' ? team1 : team2;
    
                btn.disabled = !(playerNumber == raider.number && teamName === team);
                if (!btn.disabled) {
                    btn.innerHTML = '<i class="fas fa-home"></i> Returned?';
                    btn.onclick = () => document.getElementById('return-modal').style.display = 'flex';
                }
            });
    
            endHalfBtn.disabled = true;
            timeoutBtn.disabled = true;
            allOutBtn.disabled = true;
        }
    
        function startTimer() {
            if (!gameState.isMatchStarted || gameState.isTimerRunning) return;
    
            gameState.isTimerRunning = true;
            gameState.lastUpdateTime = Date.now();
            gameState.timerInterval = setInterval(updateGameTimer, 1000);
    
            startTimerBtn.disabled = true;
            pauseTimerBtn.disabled = false;
            resetTimerBtn.disabled = false;
    
            addEventToLog('Match timer started');
        }
    
        function pauseTimer() {
            if (!gameState.isTimerRunning) return;
    
            clearInterval(gameState.timerInterval);
            gameState.isTimerRunning = false;
    
            startTimerBtn.disabled = false;
            pauseTimerBtn.disabled = true;
    
            addEventToLog('Match timer paused');
        }
    
        function resetTimer() {
            pauseTimer();
            gameState.timeRemaining = 1200;
            updateTimerDisplay();
    
            startTimerBtn.disabled = false;
            pauseTimerBtn.disabled = true;
            resetTimerBtn.disabled = true;
    
            addEventToLog('Match timer reset');
        }
    
        function updateGameTimer() {
            const now = Date.now();
            const deltaTime = (now - gameState.lastUpdateTime) / 1000;
            gameState.lastUpdateTime = now;
    
            gameState.timeRemaining = Math.max(0, gameState.timeRemaining - deltaTime);
            updateTimerDisplay();
    
            if (gameState.timeRemaining <= 0) {
                clearInterval(gameState.timerInterval);
                gameState.isTimerRunning = false;
                addEventToLog(`Half ${gameState.currentHalf} time completed!`);
                startTimerBtn.disabled = true;
                pauseTimerBtn.disabled = true;
            }
        }
    
        function endHalf() {
            if (!gameState.isMatchStarted) return;
    
            clearInterval(gameState.timerInterval);
            gameState.isTimerRunning = false;
    
            if (gameState.currentHalf < 2) {
                gameState.currentHalf++;
                gameState.timeRemaining = 1200;
                updateTimerDisplay();
                currentHalfElement.textContent = gameState.currentHalf;
    
                startTimerBtn.disabled = false;
                pauseTimerBtn.disabled = true;
                resetTimerBtn.disabled = true;
    
                addEventToLog(`Half ${gameState.currentHalf} started!`);
            } else {
                addEventToLog('Match ended!');
                const dat = {
                    gameStatus: "Completed", 
                    sportName: "Kabaddi",
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
                gameState.isMatchStarted = false;
                endHalfBtn.disabled = true;
                timeoutBtn.disabled = true;
                allOutBtn.disabled = true;
                startTimerBtn.disabled = true;
                pauseTimerBtn.disabled = true;
                resetTimerBtn.disabled = true;
                updatePlayerActionButtons();
            }
        }
    
        function callTimeout() {
            if (!gameState.isMatchStarted) return;
    
            const team = team1.timeouts > team2.timeouts ? team1 : team2;
            if (team.timeouts > 0) {
                team.timeouts--;
                timeoutsLeftElement.textContent = Math.min(team1.timeouts, team2.timeouts);
                addEventToLog(`${team.name} called a timeout (${team.timeouts} remaining)`);
    
                if (gameState.isTimerRunning) {
                    pauseTimer();
                }
            } else {
                addEventToLog(`${team.name} has no timeouts left!`);
            }
        }
    
        function handleAllOut() {
            if (!gameState.isMatchStarted) return;
    
            const allOutTeam = confirm(`${team1.name} got all out? (OK for ${team1.name}, Cancel for ${team2.name})`) ? team1 : team2;
            const opponent = allOutTeam === team1 ? team2 : team1;
    
            opponent.score += 2;
            sendScoreToServer(opponent, 2);
            updateScores();
    
            addEventToLog(`ALL OUT! ${allOutTeam.name} is all out. ${opponent.name} gets 2 points`);
        }
    
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    
        actionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.getAttribute('data-action');
                handleAction(action);
            });
        });
    
        startGameBtn.addEventListener('click', startMatch);
        endHalfBtn.addEventListener('click', endHalf);
        timeoutBtn.addEventListener('click', callTimeout);
        allOutBtn.addEventListener('click', handleAllOut);
        startTimerBtn.addEventListener('click', startTimer);
        pauseTimerBtn.addEventListener('click', pauseTimer);
        resetTimerBtn.addEventListener('click', resetTimer);
        document.getElementById('return-success').addEventListener('click', () => {
            handlePlayerReturn(true);
            document.getElementById('return-modal').style.display = 'none';
        });
    
        document.getElementById('return-failed').addEventListener('click', () => {
            handlePlayerReturn(false);
            document.getElementById('return-modal').style.display = 'none';
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    
        function init() {
            team1NameElement.textContent = team1.name;
            team2NameElement.textContent = team2.name;
            renderPlayers();
            updateScores();
            updateTimerDisplay();
            currentHalfElement.textContent = gameState.currentHalf;
            timeoutsLeftElement.textContent = Math.min(team1.timeouts, team2.timeouts);
    
            addEventToLog('Kabaddi Match Admin is ready. Start the match when ready!');
        }
    
        init();
    }
});