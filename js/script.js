document.addEventListener("DOMContentLoaded", function () {
    const stateSelector = document.getElementById("stateSelector");
    const container = document.getElementById("officialsContainer");
    const csvURL = "https://raw.githubusercontent.com/ozarkthedog/civic_lookup/main/data/officials.csv";
    
    async function loadCSV() {
        const response = await fetch(csvURL);
        const csvText = await response.text();
        console.log("CSV Loaded:", csvText); // Debugging
        return new Promise(resolve => {
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: results => {
                    console.log("Parsed CSV Data:", results.data); // Debugging
                    resolve(results.data);
                }
            });
        });
    }

    async function displayOfficials() {
        const state = stateSelector.value.trim().toUpperCase();
        if (!state) return;

        container.innerHTML = "Loading officials...";

        const csvOfficials = await loadCSV();
        console.log("All Officials Data:", csvOfficials); // Debugging

        const filteredOfficials = csvOfficials.filter(official => 
            official.state && official.state.trim().toUpperCase() === state
        );

        console.log("Filtered Officials:", filteredOfficials); // Debugging

        container.innerHTML = "";

        if (filteredOfficials.length === 0) {
            container.innerHTML = "<p>No officials found for this state.</p>";
            return;
        }

        filteredOfficials.forEach(official => {
            const partyClass = official.party ? official.party.toLowerCase().replace(/\s+/g, "-") : "unknown";

            const card = document.createElement("div");
            card.classList.add("official-card");

            card.innerHTML = `
                <img src="${official.photoUrl || 'default-image.jpg'}" alt="${official.full_name}">
                <h3>${official.full_name}</h3>
                <p>${official.type || "Unknown Title"}</p>
                <div class="party ${partyClass}">${official.party || "Unknown Party"}</div>
                <p>State Office: <br><span>${official.address || "N/A"}</span></p>
                <p>D.C. Office: <br><span>${official.dc_address || "N/A"}</span></p>
                <a href="${official.url || '#'}" class="website-btn" target="_blank">Contact on Website</a>
            `;
            container.appendChild(card);
        });
    }

    stateSelector.addEventListener("change", displayOfficials);
});



