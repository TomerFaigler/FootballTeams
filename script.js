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
    fetch('players.json')
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
        mustTogetherPairs.forEach((pair, index) => {
            const li = document.createElement("li");
            li.textContent = `${pair.player1} & ${pair.player2}`;
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", () => {
                mustTogetherPairs.splice(index, 1);
                localStorage.setItem('mustTogetherPairs', JSON.stringify(mustTogetherPairs));
                displayMustTogetherPairs();
            });
            li.appendChild(deleteBtn);
            mustTogetherList.appendChild(li);
        });
    }

    displayMustTogetherPairs();

    // Add Must Together Pair
    document.getElementById("add-pair-btn").addEventListener("click", function() {
        const player1 = prompt("Enter the name of the first player:");
        const player2 = prompt("Enter the name of the second player:");

        if (player1 && player2) {
            const playerExists1 = players.some(player => player.name === player1);
            const playerExists2 = players.some(player => player.name === player2);

            if (playerExists1 && playerExists2) {
                mustTogetherPairs.push({ player1, player2 });
                localStorage.setItem('mustTogetherPairs', JSON.stringify(mustTogetherPairs));
                displayMustTogetherPairs();
            } else {
                alert("One or both player names do not exist. Please enter valid player names.");
            }
        }
    });

    // Display Cannot Together Pairs
    function displayCannotTogetherPairs() {
        const cannotTogetherList = document.getElementById("cannot-together-list");
        cannotTogetherList.innerHTML = "";
        cannotTogetherPairs.forEach((pair, index) => {
            const li = document.createElement("li");
            li.textContent = `${pair.player1} & ${pair.player2}`;
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", () => {
                cannotTogetherPairs.splice(index, 1);
                localStorage.setItem('cannotTogetherPairs', JSON.stringify(cannotTogetherPairs));
                displayCannotTogetherPairs();
            });
            li.appendChild(deleteBtn);
            cannotTogetherList.appendChild(li);
        });
    }

    displayCannotTogetherPairs();

    // Add Cannot Together Pair
    document.getElementById("add-pair-cannot-btn").addEventListener("click", function() {
        const player1 = prompt("Enter the name of the first player:");
        const player2 = prompt("Enter the name of the second player:");

        if (player1 && player2) {
            const playerExists1 = players.some(player => player.name === player1);
            const playerExists2 = players.some(player => player.name === player2);

            if (playerExists1 && playerExists2) {
                cannotTogetherPairs.push({ player1, player2 });
                localStorage.setItem('cannotTogetherPairs', JSON.stringify(cannotTogetherPairs));
                displayCannotTogetherPairs();
            } else {
                alert("One or both player names do not exist. Please enter valid player names.");
            }
        }
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

    // Generate Teams
    document.getElementById("generate-teams-btn").addEventListener("click", function() {
        const numTeams = parseInt(document.getElementById("num-teams").value);
        if (isNaN(numTeams) || numTeams < 2) {
            alert("Please enter a valid number of teams (2 or more).");
            return;
        }

        const selectedPlayers = Array.from(document.querySelectorAll("#players-subset-list input:checked"))
            .map(checkbox => players.find(player => player.name === checkbox.value));

        if (selectedPlayers.length < numTeams) {
            alert("Not enough players selected to form the required number of teams.");
            return;
        }

        const teams = generateTeams(selectedPlayers, numTeams);
        displayTeams(teams);
    });

    // Generate Teams Logic
    function generateTeams(selectedPlayers, numTeams) {
        const teams = Array.from({ length: numTeams }, () => []);
        const mustTogetherHandled = [];

        // Handle must-together pairs first
        mustTogetherPairs.forEach(pair => {
            if (!mustTogetherHandled.includes(pair.player1) && !mustTogetherHandled.includes(pair.player2)) {
                const teamIndex = getSmallestTeamIndex(teams);
                const player1 = selectedPlayers.find(player => player.name === pair.player1);
                const player2 = selectedPlayers.find(player => player.name === pair.player2);
                if (player1 && player2) {
                    teams[teamIndex].push(player1, player2);
                    mustTogetherHandled.push(pair.player1, pair.player2);
                }
            }
        });

        // Shuffle and add remaining players while considering cannot-together pairs
        const remainingPlayers = selectedPlayers.filter(player => !mustTogetherHandled.includes(player.name));
        remainingPlayers.sort(() => 0.5 - Math.random()); // Shuffle the remaining players

        remainingPlayers.forEach(player => {
            let teamIndex = getSmallestTeamIndex(teams);
            const cannotBeTogetherWith = cannotTogetherPairs
                .filter(pair => pair.player1 === player.name || pair.player2 === player.name)
                .map(pair => pair.player1 === player.name ? pair.player2 : pair.player1);

            // Find a team where the player can go without violating cannot-together constraints
            for (let i = 0; i < teams.length; i++) {
                if (!teams[i].some(teammate => cannotBeTogetherWith.includes(teammate.name))) {
                    teamIndex = i;
                    break;
                }
            }

            teams[teamIndex].push(player);
        });

        // Balance teams based on average rank
        balanceTeamsByRank(teams);

        return teams;
    }

    function getSmallestTeamIndex(teams) {
        return teams.reduce((smallestIndex, team, index, array) =>
            team.length < array[smallestIndex].length ? index : smallestIndex
        , 0);
    }

    function balanceTeamsByRank(teams) {
        let teamsWithAvg = teams.map(team => ({
            team,
            averageRank: team.reduce((acc, player) => acc + player.rank, 0) / team.length
        }));

        // Sort teams by average rank
        teamsWithAvg.sort((a, b) => a.averageRank - b.averageRank);

        // Try swapping players between teams to balance average rank
        let swapped = true;
        while (swapped) {
            swapped = false;
            for (let i = 0; i < teamsWithAvg.length - 1; i++) {
                const currentTeam = teamsWithAvg[i];
                const nextTeam = teamsWithAvg[i + 1];

                for (let j = 0; j < currentTeam.team.length; j++) {
                    for (let k = 0; k < nextTeam.team.length; k++) {
                        const potentialSwap = [...currentTeam.team];
                        [potentialSwap[j], nextTeam.team[k]] = [nextTeam.team[k], currentTeam.team[j]];

                        const newCurrentAvg = potentialSwap.reduce((acc, player) => acc + player.rank, 0) / potentialSwap.length;
                        const newNextAvg = nextTeam.team.reduce((acc, player) => acc + player.rank, 0) / nextTeam.team.length;

                        if (Math.abs(newCurrentAvg - newNextAvg) < Math.abs(currentTeam.averageRank - nextTeam.averageRank)) {
                            [currentTeam.team[j], nextTeam.team[k]] = [nextTeam.team[k], currentTeam.team[j]];
                            currentTeam.averageRank = newCurrentAvg;
                            nextTeam.averageRank = newNextAvg;
                            swapped = true;
                        }
                    }
                }
            }
        }
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
