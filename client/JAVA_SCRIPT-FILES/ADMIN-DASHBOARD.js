

let editingIndex = -1;
let countteam1 = 1;
let countteam2 = 1;


const matchForm = document.getElementById("matchform");
const logoutButton = document.getElementById("logout");




function createPlayerField1() {
  const div = document.createElement("div");
  div.className = "player-field";
  const sport = document.getElementById("sport").value;
  let html = `<input type="text" class="player-name" placeholder="Player Name" required />`;

  //add them on top of the below if statement
  if (sport === "Basketball") {
    html += `
                 <select class="player-role"  required>
                    <option value="">Select Role</option>
                    <option value="Point Guard">Point Guard</option>
                    <option value="Shooting Guard">Shooting Guard</option>
                    <option value="Small Forward">Small Forward</option>
                    <option value="Power Forward">Power Forward</option>
                    <option value="Center">Center</option>
                 </select>`;
  } else if (sport === "Football") {
    html += `<select class="player-role"  required>
                    <option value="">Select Role</option>
                    <option value="Striker">Striker</option>
                    <option value="Defender">Defender</option>
                    <option value="Midfielder">Midfielder</option>
                    <option value="Goalkeeper">Goalkeeper</option>
                 </select>`;

  } else if (sport === "Kabbadi") {
    html += `<select class="player-role"  required>
                    <option value="">Select Role</option>
                    <option value="Raider">Raider</option>
                    <option value="Defender">Defender</option>
                 </select>`;
  } else {
    // Fallback if other sports are added later.
    html += `<input type="text" class="player-role" placeholder="Player Role" required />`;
  }
  html += `<button type="button" class="remove-player" >Remove</button>`;
  div.innerHTML = html;
  return div;
}

function createPlayerField2() {
  const div = document.createElement("div");
  div.className = "player-field2";
  sport = document.getElementById("sport").value;
  let html = `<input type="text" class="player-name" placeholder="Player Name" required  />`;

  //add them on top of the below if statement
  if (sport === "Basketball") {
    html += `
                 <select class="player-role"  required>
                    <option value="">Select Role</option>
                    <option value="Point Guard">Point Guard</option>
                    <option value="Shooting Guard">Shooting Guard</option>
                    <option value="Small Forward">Small Forward</option>
                    <option value="Power Forward">Power Forward</option>
                    <option value="Center">Center</option>
                 </select>`;
  } else if (sport === "Football") {
    html += `<select class="player-role"  required>
                    <option value="">Select Role</option>
                    <option value="Striker">Striker</option>
                    <option value="Defender">Defender</option>
                    <option value="Midfielder">Midfielder</option>
                    <option value="Goalkeeper">Goalkeeper</option>
                 </select>`;

  } else if (sport === "Kabbadi") {
    html += `<select class="player-role"  required>
                    <option value="">Select Role</option>
                    <option value="Raider">Raider</option>
                    <option value="Defender">Defender</option>
                 </select>`;
  } else {
    // Fallback if other sports are added later.
    html += `<input type="text" class="player-role" placeholder="Player Role" required />`;
  }
  html += `<button type="button" class="remove-player" ">Remove</button>`;
  div.innerHTML = html;
  return div;
}

// Add dynamic player fields for Team 1 and Team 2
document
  .getElementById("add-team1-player")
  .addEventListener("click", function () {
    const team1Container = document.getElementById("team1-players");
    team1Container.appendChild(createPlayerField1());
    count1++;
  });

document
  .getElementById("add-team2-player")
  .addEventListener("click", function () {
    const team2Container = document.getElementById("team2-players");
    team2Container.appendChild(createPlayerField2());
    count2++;
  });

// Remove player field (using event delegation)
document.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("remove-player")) {
    e.target.parentElement.remove();
  }
});

// When sport selection changes, clear the existing dynamic player fields.
document.getElementById("sport").addEventListener("change", function () {
  document
    .getElementById("team1-players")
    .querySelectorAll(".player-field")
    .forEach((el) => el.remove());
    count1 = 1;
  document
    .getElementById("team2-players")
    .querySelectorAll(".player-field")
    .forEach((el) => el.remove());
    count2 = 1;
});






// Handle new match form submission (and updating if editing)
matchForm.addEventListener("click", async function (e) { 
  e.preventDefault();
  const sport = document.getElementById("sport").value;
  
  const team1Name = document.getElementById("team1-name").value;
  const team2Name = document.getElementById("team2-name").value;
  console.log('check2',sport,team1Name,team2Name); 
  // Gather Team 1 player information
  const team1Players = Array.from(
    document.querySelectorAll("#team1-players .player-field")
  ).map((field) => {
    const player = { name: field.querySelector(".player-name").value };

    player.role = field.querySelector(".player-role").value;
    return player;
  });
  // Gather Team 2 player information
  console.log('starting 2');
  const team2Players = Array.from(
    document.querySelectorAll("#team2-players .player-field2")
  ).map((field) => {
    console.log('thsi si filed for team player 2',field ); 
    const player = { name: field.querySelector(".player-name").value };
    
    player.role = field.querySelector(".player-role").value;
    return player;
  });
  // console.log(sport, team1Name, team2Name, )
  
  async function sendteamdata(sports,Teamname,Players){
    // console.log('check ',sports,Teamname,Players)
    const dat = await fetch('http://localhost:8000/register-server-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sport: sports,
        teamname: Teamname,
        players: Players,
      })
    });
    // return dat; 
  }

  async function sendmatchdata(t1,t2,sport){
    const dat = await fetch('http://localhost:8000/register-match-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        team1: t1,
        team2: t2,
        sport: sport,
      })
    })
  }
  
  
  
  const response1 = await sendteamdata(sport,team1Name,team1Players);
  console.log(response1)
  const response2 = await sendteamdata(sport,team2Name,team2Players);
  console.log(response2)
  const response3 = await sendmatchdata(team1Name, team2Name, sport);
  console.log(response3)
  const newMatch = {
    sport,
    team1Name,
    team1Players,
    team2Name,
    team2Players,
  };

  let matches = JSON.parse(localStorage.getItem("matches")) || [];
  if (editingIndex === -1) {
    // New match addition
    matches.push(newMatch);
  } else {
    // Update the existing match
    matches[editingIndex] = newMatch;
    editingIndex = -1;
    // Reset the submit button label back to default
    matchForm.querySelector("button[type=submit]").textContent =
      "Add Match Data";
  }
  localStorage.setItem("matches", JSON.stringify(matches));

  
  document
    .getElementById("team1-players")
    .querySelectorAll(".player-field")
    .forEach((field) => field.remove());
  document
    .getElementById("team2-players")
    .querySelectorAll(".player-field")
    .forEach((field) => field.remove());


  console.log(sport);
  if (sport === "Football"){
    window.open('FOOTBALL-ADMIN-INPUT.html', '_blank');
  };
  if (sport === "Basketball"){
    window.open('BASKETBALL-SCORE.html', '_blank');
  };
  if (sport === "Kabbadi"){
    window.open('KABADDI-SCORE.html', '_blank');
  };

});

// Event delegation for Edit and Delete buttons on match cards
document
  .getElementById("matches-container")
  .addEventListener("click", function (e) {
    const index = e.target.getAttribute("data-index");
    let matches = JSON.parse(localStorage.getItem("matches")) || [];
    // Delete functionality
    if (e.target.classList.contains("delete-match")) {
      matches.splice(index, 1);
      localStorage.setItem("matches", JSON.stringify(matches));
      loadMatches();
    }
    // Edit functionality
    else if (e.target.classList.contains("edit-match")) {
      const match = matches[index];
      editingIndex = index;
      document.getElementById("sport").value = match.sport;
      document.getElementById("team1-name").value = match.team1Name;
      document.getElementById("team2-name").value = match.team2Name;

      // Clear existing player rows so we can repopulate them.
      const team1Container = document.getElementById("team1-players");
      const team2Container = document.getElementById("team2-players");
      team1Container
        .querySelectorAll(".player-field")
        .forEach((el) => el.remove());
      team2Container
        .querySelectorAll(".player-field")
        .forEach((el) => el.remove());

      // For Team 1 players, re-create the player fields and populate values.
      match.team1Players.forEach((p) => {
        const field = createPlayerField();
        field.querySelector(".player-name").value = p.name;

        field.querySelector(".player-role").value = p.role;
        team1Container.appendChild(field);
      });

      // For Team 2 players:
      match.team2Players.forEach((p) => {
        const field = createPlayerField();
        field.querySelector(".player-name").value = p.name;

        field.querySelector(".player-role").value = p.role;
        team2Container.appendChild(field);
      });

      // Change the submit button text to indicate edit mode.
      matchForm.querySelector("button[type=submit]").textContent =
        "Update Match Data";
    }
  });

// --- LOGOUT FUNCTIONALITY ---
if (logoutButton) {
  logoutButton.addEventListener("click", function () {
    sessionStorage.removeItem("loggedIn");
    window.location.href = "ADMIN-LOGIN-PAGE.html";
  });
}

