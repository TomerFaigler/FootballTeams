// document.addEventListener("DOMContentLoaded", function() {
//     const sections = {
//         players: document.getElementById("players-section"),
//         mustTogether: document.getElementById("must-together-section"),
//         cannotTogether: document.getElementById("cannot-together-section"),
//         teams: document.getElementById("teams-section")
//     };

//     const navLinks = {
//         players: document.getElementById("nav-players"),
//         mustTogether: document.getElementById("nav-must-together"),
//         cannotTogether: document.getElementById("nav-cannot-together"),
//         teams: document.getElementById("nav-teams")
//     };

//     // Initialize data from localStorage or set default values
//     let mustTogetherPairs = JSON.parse(localStorage.getItem('mustTogetherPairs')) || [];
//     let cannotTogetherPairs = JSON.parse(localStorage.getItem('cannotTogetherPairs')) || [];
//     let players = [];

//     // Fetch players from static JSON file
//     fetch('players_1.json')
//         .then(response => response.json())
//         .then(data => {
//             players = data;
//             displayPlayers();
//             populatePlayersSubset();
//         })
//         .catch(error => console.error('Error loading players:', error));

//     // Navigation function
//     function showSection(sectionKey) {
//         Object.keys(sections).forEach(key => {
//             sections[key].style.display = key === sectionKey ? "block" : "none";
//         });
//     }

//     // Initial display
//     showSection('players');

//     // Event listeners for navigation
//     navLinks.players.addEventListener("click", () => showSection('players'));
//     navLinks.mustTogether.addEventListener("click", () => showSection('mustTogether'));
//     navLinks.cannotTogether.addEventListener("click", () => showSection('cannotTogether'));
//     navLinks.teams.addEventListener("click", () => showSection('teams'));

//     // Display Players
//     function displayPlayers() {
//         const playersList = document.getElementById("players-list");
//         playersList.innerHTML = "";
//         players.forEach(player => {
//             const li = document.createElement("li");
//             li.textContent = `${player.name} - Rank: ${player.rank}`;
//             playersList.appendChild(li);
//         });
//     }

//     // Display Must Together Pairs
//     function displayMustTogetherPairs() {
//         const mustTogetherList = document.getElementById("must-together-list");
//         mustTogetherList.innerHTML = "";
//         mustTogetherPairs.forEach((pair, index) => {
//             const li = document.createElement("li");
//             li.textContent = `${pair.player1} & ${pair.player2}`;
//             const deleteBtn = document.createElement("button");
//             deleteBtn.textContent = "Delete";
//             deleteBtn.addEventListener("click", () => {
//                 mustTogetherPairs.splice(index, 1);
//                 localStorage.setItem('mustTogetherPairs', JSON.stringify(mustTogetherPairs));
//                 displayMustTogetherPairs();
//             });
//             li.appendChild(deleteBtn);
//             mustTogetherList.appendChild(li);
//         });
//     }

//     displayMustTogetherPairs();

//     // Add Must Together Pair
//     document.getElementById("add-pair-btn").addEventListener("click", function() {
//         const player1 = prompt("Enter the name of the first player:");
//         const player2 = prompt("Enter the name of the second player:");

//         if (player1 && player2) {
//             const playerExists1 = players.some(player => player.name === player1);
//             const playerExists2 = players.some(player => player.name === player2);

//             if (playerExists1 && playerExists2) {
//                 mustTogetherPairs.push({ player1, player2 });
//                 localStorage.setItem('mustTogetherPairs', JSON.stringify(mustTogetherPairs));
//                 displayMustTogetherPairs();
//             } else {
//                 alert("One or both player names do not exist. Please enter valid player names.");
//             }
//         }
//     });

//     // Display Cannot Together Pairs
//     function displayCannotTogetherPairs() {
//         const cannotTogetherList = document.getElementById("cannot-together-list");
//         cannotTogetherList.innerHTML = "";
//         cannotTogetherPairs.forEach((pair, index) => {
//             const li = document.createElement("li");
//             li.textContent = `${pair.player1} & ${pair.player2}`;
//             const deleteBtn = document.createElement("button");
//             deleteBtn.textContent = "Delete";
//             deleteBtn.addEventListener("click", () => {
//                 cannotTogetherPairs.splice(index, 1);
//                 localStorage.setItem('cannotTogetherPairs', JSON.stringify(cannotTogetherPairs));
//                 displayCannotTogetherPairs();
//             });
//             li.appendChild(deleteBtn);
//             cannotTogetherList.appendChild(li);
//         });
//     }

//     displayCannotTogetherPairs();

//     // Add Cannot Together Pair
//     document.getElementById("add-pair-cannot-btn").addEventListener("click", function() {
//         const player1 = prompt("Enter the name of the first player:");
//         const player2 = prompt("Enter the name of the second player:");

//         if (player1 && player2) {
//             const playerExists1 = players.some(player => player.name === player1);
//             const playerExists2 = players.some(player => player.name === player2);

//             if (playerExists1 && playerExists2) {
//                 cannotTogetherPairs.push({ player1, player2 });
//                 localStorage.setItem('cannotTogetherPairs', JSON.stringify(cannotTogetherPairs));
//                 displayCannotTogetherPairs();
//             } else {
//                 alert("One or both player names do not exist. Please enter valid player names.");
//             }
//         }
//     });

//     // Populate Players Subset for Team Selection
//     function populatePlayersSubset() {
//         const playersSubsetList = document.getElementById("players-subset-list");
//         playersSubsetList.innerHTML = "";
//         players.forEach(player => {
//             const li = document.createElement("li");
//             const checkbox = document.createElement("input");
//             checkbox.type = "checkbox";
//             checkbox.value = player.name;
//             li.appendChild(checkbox);
//             li.appendChild(document.createTextNode(`${player.name} - Rank: ${player.rank}`));
//             playersSubsetList.appendChild(li);
//         });
//     }

//     // Generate Teams
//     document.getElementById("generate-teams-btn").addEventListener("click", function() {
//         const numTeams = parseInt(document.getElementById("num-teams").value);
//         if (isNaN(numTeams) || numTeams < 2) {
//             alert("Please enter a valid number of teams (2 or more).");
//             return;
//         }

//         const selectedPlayers = Array.from(document.querySelectorAll("#players-subset-list input:checked"))
//             .map(checkbox => players.find(player => player.name === checkbox.value));

//         if (selectedPlayers.length < numTeams) {
//             alert("Not enough players selected to form the required number of teams.");
//             return;
//         }

//         const teams = generateTeams(selectedPlayers, numTeams);
//         displayTeams(teams);
//     });

//     // Generate Teams Logic
//     function generateTeams(selectedPlayers, numTeams) {
//         let teams = [];
//         let attempts = 0;
//         let threshold = 0.5;
        
//         while (attempts < 1000) {
//             // Randomly distribute players into teams
//             teams = Array.from({ length: numTeams }, () => []);
//             const mustTogetherHandled = [];
    
//             // Handle must-together pairs first
//             mustTogetherPairs.forEach(pair => {
//                 if (!mustTogetherHandled.includes(pair.player1) && !mustTogetherHandled.includes(pair.player2)) {
//                     const teamIndex = getSmallestTeamIndex(teams);
//                     const player1 = selectedPlayers.find(player => player.name === pair.player1);
//                     const player2 = selectedPlayers.find(player => player.name === pair.player2);
//                     if (player1 && player2) {
//                         teams[teamIndex].push(player1, player2);
//                         mustTogetherHandled.push(pair.player1, pair.player2);
//                     }
//                 }
//             });
    
//             // Shuffle and add remaining players while considering cannot-together pairs
//             const remainingPlayers = selectedPlayers.filter(player => !mustTogetherHandled.includes(player.name));
//             remainingPlayers.sort(() => 0.5 - Math.random()); // Shuffle the remaining players
    
//             remainingPlayers.forEach(player => {
//                 let teamIndex = getSmallestTeamIndex(teams);
//                 const cannotBeTogetherWith = cannotTogetherPairs
//                     .filter(pair => pair.player1 === player.name || pair.player2 === player.name)
//                     .map(pair => pair.player1 === player.name ? pair.player2 : pair.player1);
    
//                 // Find a team where the player can go without violating cannot-together constraints
//                 for (let i = 0; i < teams.length; i++) {
//                     if (!teams[i].some(teammate => cannotBeTogetherWith.includes(teammate.name))) {
//                         teamIndex = i;
//                         break;
//                     }
//                 }
    
//                 teams[teamIndex].push(player);
//             });
    
//             // Calculate average ranks for teams and check the max difference
//             const teamAverages = teams.map(team => team.reduce((sum, player) => sum + player.rank, 0) / team.length);
//             const maxAvg = Math.max(...teamAverages);
//             const minAvg = Math.min(...teamAverages);
//             const maxDifference = maxAvg - minAvg;
    
//             if (maxDifference <= threshold) {
//                 return teams;
//             }
    
//             attempts++;
    
//             // Increase the threshold after every 100 attempts
//             if (attempts % 100 === 0) {
//                 threshold += 0.1;
//             }
//         }
    
//         // If teams couldn't be generated after 1000 attempts, return an error
//         alert("Unable to generate balanced teams after 1000 attempts. Please try again.");
//         return null;
//     }
    

//     function getSmallestTeamIndex(teams) {
//         return teams.reduce((smallestIndex, team, index, array) =>
//             team.length < array[smallestIndex].length ? index : smallestIndex
//         , 0);
//     }



//     function displayTeams(teams) {
//         const teamsResult = document.getElementById("teams-result");
//         teamsResult.innerHTML = "";
    
//         teams.forEach((team, index) => {
//             const teamDiv = document.createElement("div");
//             teamDiv.innerHTML = `<h3>Team ${index + 1}</h3><ul>`;
//             let totalRank = 0;
    
//             team.forEach(player => {
//                 teamDiv.innerHTML += `<li>${player.name} - Rank: ${player.rank}</li>`;
//                 totalRank += player.rank;
//             });
    
//             const averageRank = (totalRank / team.length).toFixed(2);
//             teamDiv.innerHTML += `</ul><p style="color: red;">Average Rank: ${averageRank}</p>`;
//             teamsResult.appendChild(teamDiv);
//         });
//     }
    
// });
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
    function updateSelectedPlayersCount() {
        const selectedCount = document.querySelectorAll("#players-subset-list input:checked").length;
        document.getElementById("selected-players-count").textContent = `Selected players: ${selectedCount}`;
    }
    
    // Display Must Together Pairs
function displayMustTogetherPairs() {
    const mustTogetherList = document.getElementById("must-together-list");
    mustTogetherList.innerHTML = "";
    mustTogetherPairs.forEach((pair, index) => {
        const li = document.createElement("li");
        li.textContent = `${pair.player1.name} & ${pair.player2.name}`;
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
    const player1Name = prompt("Enter the name of the first player:");
    const player2Name = prompt("Enter the name of the second player:");

    if (player1Name && player2Name) {
        const player1 = players.find(player => player.name === player1Name);
        const player2 = players.find(player => player.name === player2Name);

        if (player1 && player2) {
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
        li.textContent = `${pair.player1.name} & ${pair.player2.name}`;
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
    const player1Name = prompt("Enter the name of the first player:");
    const player2Name = prompt("Enter the name of the second player:");

    if (player1Name && player2Name) {
        const player1 = players.find(player => player.name === player1Name);
        const player2 = players.find(player => player.name === player2Name);

        if (player1 && player2) {
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
            checkbox.addEventListener("change", updateSelectedPlayersCount); // Update count when selection changes
            li.appendChild(checkbox);
            li.appendChild(document.createTextNode(`${player.name} - Rank: ${player.rank}`));
            playersSubsetList.appendChild(li);
        });
        
        updateSelectedPlayersCount(); // Initial count update
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

        try {
            const teams = generateTeams(selectedPlayers, numTeams, mustTogetherPairs, cannotTogetherPairs);
            displayTeams(teams);
        } catch (error) {
            alert(error.message);
        }
    });

    function generateTeams(players, numTeams, mustTogetherPairs = [], cannotTogetherPairs = []) {
        console.log(mustTogetherPairs)
        console.log(mustTogetherPairs)
        let attempts = 0;
        let threshold = 0.5;
        const maxAttempts = 10000;
    
        while (attempts < maxAttempts) {
            // Step 1: Shuffle players and create teams
            const shuffledPlayers = shufflePlayers([...players]);
            let teams = createInitialTeams(shuffledPlayers, numTeams);
    
            // Step 2: Ensure must-together pairs are in the same team
            if (!validateMustTogether(teams, mustTogetherPairs)) {
                attempts++;
                continue;
            }
    
            // Step 3: Ensure cannot-together pairs are in different teams
            if (!validateCannotTogether(teams, cannotTogetherPairs)) {
                attempts++;
                continue;
            }
    
            // Step 4: Calculate average ranks for teams and check the max difference
            const teamAverages = teams.map(team => calculateAverageRank(team));
            const maxAvg = Math.max(...teamAverages);
            const minAvg = Math.min(...teamAverages);
            const maxDifference = maxAvg - minAvg;
    
            if (maxDifference <= threshold) {
                return teams; // Valid teams found
            }
    
            attempts++;
    
            // Increase the threshold after every 100 attempts
            if (attempts % 100 === 0) {
                threshold += 0.1;
            }
        }
    
        // If teams couldn't be generated after maxAttempts
        throw new Error(`Unable to generate balanced teams after ${maxAttempts} attempts.`);
    }
    
    function shufflePlayers(players) {
        for (let i = players.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [players[i], players[j]] = [players[j], players[i]];
        }
        return players;
    }
    
    function createInitialTeams(players, numTeams) {
        const teams = Array.from({ length: numTeams }, () => []);
        players.forEach((player, index) => {
            teams[index % numTeams].push(player);
        });
        return teams;
    }
    
    function calculateAverageRank(team) {
        const totalRank = team.reduce((sum, player) => sum + player.rank, 0);
        return totalRank / team.length;
    }
    
    function validateMustTogether(teams, mustTogetherPairs) {
        return mustTogetherPairs.every(pair => {
            return teams.some(team => team.includes(pair.player1) && team.includes(pair.player2));
        });
    }
    
    function validateCannotTogether(teams, cannotTogetherPairs) {
        return cannotTogetherPairs.every(pair => {
            return teams.every(team => !(team.includes(pair.player1) && team.includes(pair.player2)));
        });
    }

    function displayTeams(teams) {
        const teamsResult = document.getElementById("teams-result");
        teamsResult.innerHTML = "";

        teams.forEach((team, index) => {
            const teamDiv = document.createElement("div");
            teamDiv.innerHTML = `<h3>Team ${index + 1}</h3><ul>`;
            let totalRank = 0;

            team.forEach(player => {
                teamDiv.innerHTML += `<li>${player.name} - Rank: ${player.rank}</li>`;
                totalRank += player.rank;
            });

            const averageRank = (totalRank / team.length).toFixed(2);
            teamDiv.innerHTML += `</ul><p style="color: red;">Average Rank: ${averageRank}</p>`;
            teamsResult.appendChild(teamDiv);
        });
    }
});

