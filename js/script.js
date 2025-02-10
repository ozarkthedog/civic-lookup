document.addEventListener("DOMContentLoaded", function () {
    const stateSelector = document.getElementById("stateSelector");
    const container = document.getElementById("officialsContainer");
    const csvURL = "https://raw.githubusercontent.com/ozarkthedog/civic_lookup/main/data/officials.csv";

    async function loadCSV() {
        const response = await fetch(csvURL);
        const csvText = await response.text();
        return new Promise(resolve => {
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: results => resolve(results.data)
            });
        });
    }

    async function displayOfficials() {
        const state = stateSelector.value;
        if (!state) return;

        container.innerHTML = "Loading officials...";

        const csvOfficials = await loadCSV();
        const filteredOfficials = csvOfficials.filter(official => official.state === state);

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
                <div class="party ${partyClass}">${official.party}</div>
                <p>State Office: <br><a href="#">${official.address || "N/A"}</a></p>
                <p>D.C. Office: <br><a href="#">${official.dc_address || "N/A"}</a></p>
                <a href="${official.url || '#'}" class="website-btn">Contact on Website</a>
                <button class="call-btn">Call Office</button>
            `;
            container.appendChild(card);
        });
    }

    stateSelector.addEventListener("change", displayOfficials);
});
