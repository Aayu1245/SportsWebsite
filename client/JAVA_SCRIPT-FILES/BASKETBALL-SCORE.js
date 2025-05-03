document.addEventListener('DOMContentLoaded', function () {
    // Sample data - in a real app, this would come from a database
    const homeTeam = {
        name: "Home Team",
        players: [
            { number: 4, name: "Point Guard", position: "PG", stats: [], fouls: 0 },
            { number: 8, name: "Shooting Guard", position: "SG", stats: [], fouls: 0 },
            { number: 10, name: "Small Forward", position: "SF", stats: [], fouls: 0 },
            { number: 15, name: "Power Forward", position: "PF", stats: [], fouls: 0 },
            { number: 23, name: "Center", position: "C", stats: [], fouls: 0 },
            { number: 5, name: "Sixth Man", position: "G", stats: [], fouls: 0 },
            { number: 7, name: "Forward", position: "F", stats: [], fouls: 0 },
            { number: 11, name: "Big Man", position: "C", stats: [], fouls: 0 }
        ],
        score: 0,
        quarterScores: [0, 0, 0, 0],
        timeouts: 7
    };

    const awayTeam = {
        name: "Away Team",
        players: [
            { number: 3, name: "Point Guard", position: "PG", stats: [], fouls: 0 },
            { number: 6, name: "Shooting Guard", position: "SG", stats: [], fouls: 0 },
            { number: 9, name: "Small Forward", position: "SF", stats: [], fouls: 0 },
            { number: 12, name: "Power Forward", position: "PF", stats: [], fouls: 0 },
            { number: 21, name: "Center", position: "C", stats: [], fouls: 0 },
            { number: 1, name: "Sixth Man", position: "G", stats: [], fouls: 0 },
            { number: 13, name: "Forward", position: "F", stats: [], fouls: 0 },
            { number: 24, name: "Big Man", position: "C", stats: [], fouls: 0 }
        ],
        score: 0,
        quarterScores: [0, 0, 0, 0],
        timeouts: 7
    };

    // Game state
    let gameState = {
        currentQuarter: 1,
        isGameStarted: false,
        timeRemaining: 720, // 12 minutes in seconds
        timerInterval: null,
        lastUpdateTime: null,
        gameStartTime: null
    };

    // DOM elements
    const homeTeamElement = document.getElementById('team1-players');
    const awayTeamElement = document.getElementById('team2-players');
    const homeScoreElement = document.querySelector('#team1-score .score');
    const awayScoreElement = document.querySelector('#team2-score .score');
    const homeQuarterElements = [
        document.getElementById('team1-q1'),
        document.getElementById('team1-q2'),
        document.getElementById('team1-q3'),
        document.getElementById('team1-q4')
    ];
    const awayQuarterElements = [
        document.getElementById('team2-q1'),
        document.getElementById('team2-q2'),
        document.getElementById('team2-q3'),
        document.getElementById('team2-q4')
    ];
    const modal = document.getElementById('action-modal');
    const playerNameElement = document.getElementById('player-name');
    const closeBtn = document.querySelector('.close-btn');
    const actionButtons = document.querySelectorAll('.action-btn');
    const eventsLog = document.getElementById('events-log');
    const gameTimerElement = document.getElementById('game-timer');
    const startGameBtn = document.getElementById('start-game');
    const endQuarterBtn = document.getElementById('end-quarter');
    const timeoutBtn = document.getElementById('timeout');
    const playerActionButtons = document.querySelectorAll('.action-btn-table');

    // Current selected player info
    let selectedPlayer = null;
    let selectedTeam = null;

    // Render players in tables
    function renderPlayers() {
        homeTeamElement.innerHTML = '';
        awayTeamElement.innerHTML = '';

        homeTeam.players.forEach(player => {
            const playerRow = createPlayerRow(player, homeTeam);
            homeTeamElement.appendChild(playerRow);
        });

        awayTeam.players.forEach(player => {
            const playerRow = createPlayerRow(player, awayTeam);
            awayTeamElement.appendChild(playerRow);
        });

        // Update player action buttons state based on game status
        updatePlayerActionButtons();
    }

    // Create player table row
    function createPlayerRow(player, team) {
        const row = document.createElement('tr');

        // Player number
        const numberCell = document.createElement('td');
        numberCell.textContent = player.number;
        row.appendChild(numberCell);

        // Player name
        const nameCell = document.createElement('td');
        nameCell.textContent = player.name;
        row.appendChild(nameCell);

        // Player position
        const positionCell = document.createElement('td');
        positionCell.textContent = player.position;
        row.appendChild(positionCell);

        // Player stats
        const statsCell = document.createElement('td');
        statsCell.className = 'player-stats';

        // Calculate points
        const points = player.stats.reduce((total, stat) => {
            if (stat.type === 'points') return total + stat.value;
            return total;
        }, 0);

        if (points > 0) {
            const badge = document.createElement('span');
            badge.className = 'stat-badge points';
            badge.textContent = `${points}PTS`;
            statsCell.appendChild(badge);
        }

        // Other stats
        const statsCount = {};
        player.stats.forEach(stat => {
            if (stat.type !== 'points') {
                statsCount[stat.type] = (statsCount[stat.type] || 0) + 1;
            }
        });

        for (const statType in statsCount) {
            const badge = document.createElement('span');
            badge.className = `stat-badge ${statType}`;

            let displayText = statType.charAt(0).toUpperCase() + statType.slice(1);
            if (statType === 'assist') displayText = `${statsCount[statType]}AST`;
            if (statType === 'rebound') displayText = `${statsCount[statType]}REB`;
            if (statType === 'steal') displayText = `${statsCount[statType]}STL`;
            if (statType === 'block') displayText = `${statsCount[statType]}BLK`;
            if (statType === 'foul') displayText = `${player.fouls}PF`;
            if (statType === 'turnover') displayText = `${statsCount[statType]}TO`;

            badge.textContent = displayText;
            statsCell.appendChild(badge);
        }

        row.appendChild(statsCell);

        // Action button
        const buttonCell = document.createElement('td');
        const button = document.createElement('button');
        button.className = 'action-btn-table';
        button.textContent = 'Add Stat';
        button.addEventListener('click', () => openModal(player, team));
        button.disabled = !gameState.isGameStarted;
        buttonCell.appendChild(button);
        row.appendChild(buttonCell);

        return row;
    }

    // Update all player action buttons state
    function updatePlayerActionButtons() {
        const buttons = document.querySelectorAll('.action-btn-table');
        buttons.forEach(button => {
            button.disabled = !gameState.isGameStarted;
        });
    }

    // Open modal with player info
    function openModal(player, team) {
        if (!gameState.isGameStarted) return;

        selectedPlayer = player;
        selectedTeam = team;
        playerNameElement.textContent = `${team.name} - #${player.number} ${player.name} (${player.position})`;
        modal.style.display = 'flex';
    }

    // Close modal
    function closeModal() {
        modal.style.display = 'none';
        selectedPlayer = null;
        selectedTeam = null;
    }

    // Add event to log
    function addEventToLog(eventText) {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        if (gameState.isGameStarted) {
            eventItem.textContent = `[Q${gameState.currentQuarter} ${timeString}] ${eventText}`;
        } else {
            eventItem.textContent = `[Game not started] ${eventText}`;
        }
        eventsLog.appendChild(eventItem);

        // Scroll to bottom
        eventsLog.scrollTop = eventsLog.scrollHeight;
    }

    // Format time (seconds to MM:SS)
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = (seconds % 60).toFixed(0); // Round seconds to 2 decimal places
        return { mins, secs };
    }

    // Update game timer display
    function updateTimerDisplay() {
        if (gameState.isGameStarted) {
            const { mins, secs } = formatTime(gameState.timeRemaining);
            gameTimerElement.textContent = `${mins}min ${secs}sec left until quarter ${gameState.currentQuarter} ends`;
        } else {
            gameTimerElement.textContent = 'Game not started';
        }
    }
    // Handle action button clicks
    function handleAction(action, points = 0) {
        if (!selectedPlayer || !selectedTeam || !gameState.isGameStarted) return;

        const actionText = `${selectedTeam.name} - #${selectedPlayer.number} ${selectedPlayer.name}`;

        switch (action) {
            case 'points':
                selectedTeam.score += points;
                selectedTeam.quarterScores[gameState.currentQuarter - 1] += points;
                selectedPlayer.stats.push({
                    type: 'points',
                    value: points,
                    time: gameState.timeRemaining,
                    timestamp: new Date().getTime()
                });
                addEventToLog(`${actionText} scored ${points} point${points > 1 ? 's' : ''}`);
                break;
            case 'assist':
                selectedPlayer.stats.push({
                    type: 'assist',
                    time: gameState.timeRemaining,
                    timestamp: new Date().getTime()
                });
                addEventToLog(`${actionText} recorded an assist`);
                break;
            case 'rebound':
                selectedPlayer.stats.push({
                    type: 'rebound',
                    time: gameState.timeRemaining,
                    timestamp: new Date().getTime()
                });
                addEventToLog(`${actionText} got a rebound`);
                break;
            case 'steal':
                selectedPlayer.stats.push({
                    type: 'steal',
                    time: gameState.timeRemaining,
                    timestamp: new Date().getTime()
                });
                addEventToLog(`${actionText} made a steal`);
                break;
            case 'block':
                selectedPlayer.stats.push({
                    type: 'block',
                    time: gameState.timeRemaining,
                    timestamp: new Date().getTime()
                });
                addEventToLog(`${actionText} blocked a shot`);
                break;
            case 'foul':
                selectedPlayer.fouls++;
                selectedPlayer.stats.push({
                    type: 'foul',
                    time: gameState.timeRemaining,
                    timestamp: new Date().getTime()
                });
                addEventToLog(`${actionText} committed a foul (${selectedPlayer.fouls} total)`);
                break;
            case 'turnover':
                selectedPlayer.stats.push({
                    type: 'turnover',
                    time: gameState.timeRemaining,
                    timestamp: new Date().getTime()
                });
                addEventToLog(`${actionText} turned over the ball`);
                break;
        }

        updateScores();
        renderPlayers();
        closeModal();
    }

    // Update scoreboard
    function updateScores() {
        homeScoreElement.textContent = homeTeam.score;
        awayScoreElement.textContent = awayTeam.score;

        for (let i = 0; i < 4; i++) {
            homeQuarterElements[i].textContent = homeTeam.quarterScores[i];
            awayQuarterElements[i].textContent = awayTeam.quarterScores[i];
        }
    }

    // Start the game
    function startGame() {
        if (gameState.isGameStarted) return;

        gameState.isGameStarted = true;
        gameState.timeRemaining = 720;
        gameState.currentQuarter = 1;
        gameState.lastUpdateTime = Date.now();
        gameState.gameStartTime = new Date();

        startGameBtn.textContent = 'Game Started';
        startGameBtn.disabled = true;
        endQuarterBtn.disabled = false;
        timeoutBtn.disabled = false;

        // Enable player action buttons
        updatePlayerActionButtons();

        // Start timer
        gameState.timerInterval = setInterval(updateGameTimer, 1000);

        addEventToLog('Game started! Tip-off!');
        updateTimerDisplay();
    }

    // Update game timer with real-time countdown
    function updateGameTimer() {
        const now = Date.now();
        const deltaTime = (now - gameState.lastUpdateTime) / 1000; // in seconds
        gameState.lastUpdateTime = now;

        gameState.timeRemaining = Math.max(0, gameState.timeRemaining - deltaTime);
        updateTimerDisplay();

        if (gameState.timeRemaining <= 0) {
            clearInterval(gameState.timerInterval);
            addEventToLog(`Quarter ${gameState.currentQuarter} ended!`);
        }
    }

    // End current quarter and start next one
    function endQuarter() {
        if (!gameState.isGameStarted) return;

        clearInterval(gameState.timerInterval);

        if (gameState.currentQuarter < 4) {
            gameState.currentQuarter++;
            gameState.timeRemaining = 720;
            gameState.lastUpdateTime = Date.now();
            updateTimerDisplay();

            // Start timer for new quarter
            gameState.timerInterval = setInterval(updateGameTimer, 1000);

            addEventToLog(`Quarter ${gameState.currentQuarter} started!`);
        } else {
            addEventToLog('Game ended!');
            gameState.isGameStarted = false;
            endQuarterBtn.disabled = true;
            timeoutBtn.disabled = true;
            updatePlayerActionButtons();
        }
    }

    // Call timeout
    function callTimeout() {
        if (!gameState.isGameStarted) return;

        const team = homeTeam.timeouts > awayTeam.timeouts ? homeTeam : awayTeam;
        if (team.timeouts > 0) {
            team.timeouts--;
            addEventToLog(`${team.name} called a timeout (${team.timeouts} remaining)`);
        } else {
            addEventToLog(`${team.name} has no timeouts left!`);
        }
    }

    // Event listeners
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            const points = button.getAttribute('data-points') || 0;
            handleAction(action, parseInt(points));
        });
    });

    startGameBtn.addEventListener('click', startGame);
    endQuarterBtn.addEventListener('click', endQuarter);
    timeoutBtn.addEventListener('click', callTimeout);

    // Initialize the app
    renderPlayers();
    updateScores();
    updateTimerDisplay();

    // Set team names
    document.querySelector('#team1-score h2').textContent = homeTeam.name;
    document.querySelector('#team2-score h2').textContent = awayTeam.name;
});