document.addEventListener("DOMContentLoaded", function() {
    const sections = {
        players: document.getElementById("players-section"),
        mustTogether: document.getElementById("must-together-section"),
        cannotTogether: document.getElementById("cannot-together-section"),
        teams: document.getElementById("teams-section")
    };

    const navLinks = {
        players: document.getElementById("nav-players"),
        mustTogether: document.getElementById("nav-must-together"),
        cannotTogether: document.getElementById("nav-cannot-together"),
        teams: document.getElementById("nav-teams")
    };

    // Initialize data from localStorage or set default values
    let mustTogetherPairs = JSON.parse(localStorage.getItem('mustTogetherPairs')) || [];
    let cannotTogetherPairs = JSON.parse(localStorage.getItem('cannotTogetherPairs')) || [];
    let players = [];

    // Fetch players from static JSON file
    fetch('players_1.json')
        .then(response => response.json())
        .then(data => {
            players = data;
            displayPlayers();
            populatePlayersSubset();
        })
        .catch(error => console.error('Error loading players:', error));

    // Navigation function
    function showSection(sectionKey) {
        Object.keys(sections).forEach(key => {
            sections[key].style.display = key === sectionKey ? "block" : "none";
        });
    }

    // Initial display
    showSection('players');

    // Event listeners for navigation
    navLinks.players.addEventListener("click", () => showSection('players'));
    navLinks.mustTogether.addEventListener("click", () => showSection('mustTogether'));
    navLinks.cannotTogether.addEventListener("click", () => showSection('cannotTogether'));
    navLinks.teams.addEventListener("click", () => showSection('teams'));

    // Display Players
    function displayPlayers() {
        const playersList = document.getElementById("players-list");
        playersList.innerHTML = "";
        players.forEach(player => {
            const li = document.createElement("li");
            li.textContent = `${player.name} - Rank: ${player.rank}`;
            playersList.appendChild(li);
        });
    }

    // Display Must Together Pairs
    function displayMustTogetherPairs() {
        const mustTogetherList = document.getElementById("must-together-list");
        mustTogetherList.innerHTML = "";
        mustTogetherPairs.forEach(pair => {
            const li = document.createElement("li");
            li.textContent = `${pair.player1} & ${pair.player2}`;
            mustTogetherList.appendChild(li);
        });
    }

    displayMustTogetherPairs();

    // Add Must Together Pair
    document.getElementById("add-pair-btn").addEventListener("click", function() {
        const player1 = prompt("Enter the name of the first player:");
        const player2 = prompt("Enter the name of the second player:");

        if (player1 && player2) {
            mustTogetherPairs.push({ player1, player2 });
            localStorage.setItem('mustTogetherPairs', JSON.stringify(mustTogetherPairs)); // Save to localStorage
            displayMustTogetherPairs();
        }
    });

    // Display Cannot Together Pairs
    function displayCannotTogetherPairs() {
        const cannotTogetherList = document.getElementById("cannot-together-list");
        cannotTogetherList.innerHTML = "";
        cannotTogetherPairs.forEach(pair => {
            const li = document.createElement("li");
            li.textContent = `${pair.player1} & ${pair.player2}`;
            cannotTogetherList.appendChild(li);
        });
    }

    displayCannotTogetherPairs();

    // Add Cannot Together Pair
    document.getElementById("add-pair-cannot-btn").addEventListener("click", function() {
        const player1 = prompt("Enter the name of the first player:");
        const player2 = prompt("Enter the name of the second player:");

        if (player1 && player2) {
            cannotTogetherPairs.push({ player1, player2 });
            localStorage.setItem('cannotTogetherPairs', JSON.stringify(cannotTogetherPairs)); // Save to localStorage
            displayCannotTogetherPairs();
        }
    });

    // Generate Teams
    document.getElementById("generate-teams-btn").addEventListener("click", function() {
        const numTeams = parseInt(document.getElementById("num-teams").value);
        if (isNaN(numTeams) || numTeams < 2) {
            alert("Please enter a valid number of teams (2 or more).");
            return;
        }

        const teams = generateTeams(players, numTeams);
        displayTeams(teams);
    });

    // Populate Players Subset for Team Selection
    function populatePlayersSubset() {
        const playersSubsetList = document.getElementById("players-subset-list");
        playersSubsetList.innerHTML = "";
        players.forEach(player => {
            const li = document.createElement("li");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = player.name;
            li.appendChild(checkbox);
            li.appendChild(document.createTextNode(`${player.name} - Rank: ${player.rank}`));
            playersSubsetList.appendChild(li);
        });
    }

    // Generate Teams Logic
    function generateTeams(playerList, numTeams) {
        // Filter players based on selected checkboxes
        const selectedPlayers = Array.from(document.querySelectorAll("#players-subset-list input:checked"))
            .map(checkbox => playerList.find(player => player.name === checkbox.value));

        // Shuffling players
        selectedPlayers.sort(() => 0.5 - Math.random());

        // Splitting into teams
        const teams = Array.from({ length: numTeams }, () => []);
        selectedPlayers.forEach((player, index) => {
            teams[index % numTeams].push(player);
        });

        // TODO: Adjust teams based on rank and must/cannot together pairs
        return teams;
    }

    // Display Teams
    function displayTeams(teams) {
        const teamsResult = document.getElementById("teams-result");
        teamsResult.innerHTML = "";

        teams.forEach((team, index) => {
            const teamDiv = document.createElement("div");
            teamDiv.innerHTML = `<h3>Team ${index + 1}</h3><ul>`;
            team.forEach(player => {
                teamDiv.innerHTML += `<li>${player.name} - Rank: ${player.rank}</li>`;
            });
            teamDiv.innerHTML += `</ul>`;
            teamsResult.appendChild(teamDiv);
        });
    }
});
