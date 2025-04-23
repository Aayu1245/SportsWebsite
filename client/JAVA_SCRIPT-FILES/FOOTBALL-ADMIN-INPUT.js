document.addEventListener('DOMContentLoaded', function() {
    // Sample data - in a real app, this would come from a database
    const team1 = {
        name: "Team A",
        players: [
            { number: 1, name: "Goalkeeper", actions: [] },
            { number: 2, name: "Defender 1", actions: [] },
            { number: 3, name: "Defender 2", actions: [] },
            { number: 4, name: "Midfielder 1", actions: [] },
            { number: 5, name: "Midfielder 2", actions: [] },
            { number: 6, name: "Forward 1", actions: [] },
            { number: 7, name: "Forward 2", actions: [] },
            { number: 8, name: "Substitute 1", actions: [] },
            { number: 9, name: "Substitute 2", actions: [] },
            { number: 10, name: "Substitute 3", actions: [] },
            { number: 11, name: "Substitute 4", actions: [] }
        ],
        score: 0
    };
    
    const team2 = {
        name: "Team B",
        players: [
            { number: 1, name: "Goalkeeper", actions: [] },
            { number: 2, name: "Defender 1", actions: [] },
            { number: 3, name: "Defender 2", actions: [] },
            { number: 4, name: "Midfielder 1", actions: [] },
            { number: 5, name: "Midfielder 2", actions: [] },
            { number: 6, name: "Forward 1", actions: [] },
            { number: 7, name: "Forward 2", actions: [] },
            { number: 8, name: "Substitute 1", actions: [] },
            { number: 9, name: "Substitute 2", actions: [] },
            { number: 10, name: "Substitute 3", actions: [] },
            { number: 11, name: "Substitute 4", actions: [] }
        ],
        score: 0
    };
    
    // DOM elements
    const team1Element = document.getElementById('team1-players');
    const team2Element = document.getElementById('team2-players');
    const team1ScoreElement = document.querySelector('#team1-score .score');
    const team2ScoreElement = document.querySelector('#team2-score .score');
    const modal = document.getElementById('action-modal');
    const playerNameElement = document.getElementById('player-name');
    const closeBtn = document.querySelector('.close-btn');
    const actionButtons = document.querySelectorAll('.action-btn');
    const eventsLog = document.getElementById('events-log');
    
    // Current selected player info
    let selectedPlayer = null;
    let selectedTeam = null;
    
    // Render players in tables
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
        
        // Player actions
        const actionsCell = document.createElement('td');
        actionsCell.className = 'player-actions';
        
        player.actions.forEach(action => {
            const badge = document.createElement('span');
            badge.className = `action-badge ${action.type}`;
            badge.textContent = action.type.charAt(0).toUpperCase() + action.type.slice(1);
            if (action.type === 'yellow') badge.textContent = 'Yellow';
            if (action.type === 'red') badge.textContent = 'Red';
            actionsCell.appendChild(badge);
        });
        
        row.appendChild(actionsCell);
        
        // Action button
        const buttonCell = document.createElement('td');
        const button = document.createElement('button');
        button.className = 'action-btn-table';
        button.textContent = 'Add Action';
        button.addEventListener('click', () => openModal(player, team));
        buttonCell.appendChild(button);
        row.appendChild(buttonCell);
        
        return row;
    }
    
    // Open modal with player info
    function openModal(player, team) {
        selectedPlayer = player;
        selectedTeam = team;
        playerNameElement.textContent = `${team.name} - ${player.number} ${player.name}`;
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
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        eventItem.textContent = `[${timeString}] ${eventText}`;
        eventsLog.appendChild(eventItem);
        
        // Scroll to bottom
        eventsLog.scrollTop = eventsLog.scrollHeight;
    }
    
    // Handle action button clicks
    function handleAction(action) {
        if (!selectedPlayer || !selectedTeam) return;
        
        const actionText = `${selectedTeam.name} - Player ${selectedPlayer.number} ${selectedPlayer.name}`;
        
        switch(action) {
            case 'goal':
                selectedTeam.score++;
                selectedPlayer.actions.push({ type: 'goal', time: new Date() });
                addEventToLog(`${actionText} scored a goal!`);
                break;
            case 'foul':
                selectedPlayer.actions.push({ type: 'foul', time: new Date() });
                addEventToLog(`${actionText} committed a foul`);
                break;
            case 'yellow':
                selectedPlayer.actions.push({ type: 'yellow', time: new Date() });
                addEventToLog(`${actionText} received a yellow card`);
                break;
            case 'red':
                selectedPlayer.actions.push({ type: 'red', time: new Date() });
                addEventToLog(`${actionText} received a red card`);
                break;
        }
        
        updateScores();
        renderPlayers();
        closeModal();
    }
    
    // Update scoreboard
    function updateScores() {
        team1ScoreElement.textContent = team1.score;
        team2ScoreElement.textContent = team2.score;
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
            handleAction(action);
        });
    });
    
    // Initialize the app
    renderPlayers();
    updateScores();
    
    // Set team names
    document.querySelector('#team1-score h2').textContent = team1.name;
    document.querySelector('#team2-score h2').textContent = team2.name;
    
    // Add welcome message to events log
    addEventToLog('Match started!');
});