const characterBar = document.getElementById("character-bar");
const detailedInfo = document.getElementById("detailed-info");
const votesForm = document.getElementById("votes-form");
const votesInput = document.getElementById("votes");
const resetButton = document.getElementById("reset-btn");

const baseUrl = "http://localhost:3000/characters";

function fetchCharacters() {
    fetch(baseUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((characters) => {
            characterBar.innerHTML = "";
            characters.forEach((character) => {
                const characterSpan = document.createElement("span");
                characterSpan.textContent = character.name;
                characterSpan.addEventListener("click", () => displayCharacterDetails(character.id));
                characterBar.appendChild(characterSpan);
            });
        })
        .catch((error) => {
            console.error("Error fetching characters:", error);
            alert("Failed to load characters. Check the console for details.");
        });
}
function displayCharacterDetails(characterId) {
    fetch(`${baseUrl}/${characterId}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((character) => {
            detailedInfo.innerHTML = `
                <h2>${character.name}</h2>
                <img src="${character.image}" alt="${character.name}">
                <p>Total Votes: <span id="character-votes">${character.votes}</span></p>
            `;
            detailedInfo.dataset.characterId = character.id; 
        })
        .catch((error) => {
            console.error("Error fetching character details:", error);
            alert("Failed to load character details. Check the console for details.");
        });
}

votesForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const characterId = detailedInfo.dataset.characterId;
    if (!characterId) return;

    const votesToAdd = parseInt(votesInput.value);
    if (isNaN(votesToAdd)) {
        alert("Please enter a valid number of votes.");
        return;
    }

    const currentVotesElement = document.getElementById("character-votes");
    const currentVotes = parseInt(currentVotesElement.textContent) || 0;
    const newVotes = currentVotes + votesToAdd;

    fetch(`${baseUrl}/${characterId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ votes: newVotes }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((updatedCharacter) => {
        
            currentVotesElement.textContent = updatedCharacter.votes;
            votesInput.value = ""; 
        })
        .catch((error) => {
            console.error("Error updating votes:", error);
            alert("Failed to update votes. Check the console for details.");
        });
});

resetButton.addEventListener("click", () => {
    const characterId = detailedInfo.dataset.characterId;
    if (!characterId) return;

    fetch(`${baseUrl}/${characterId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ votes: 0 }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((updatedCharacter) => {

            document.getElementById("character-votes").textContent = updatedCharacter.votes;
        })
        .catch((error) => {
            console.error("Error resetting votes:", error);
            alert("Failed to reset votes. Check the console for details.");
        });
});

fetchCharacters();