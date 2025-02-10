document.addEventListener("DOMContentLoaded", function () {
    const stateSelector = document.getElementById("stateSelector");
    const container = document.getElementById("officialsContainer");
    const csvURL = "https://raw.githubusercontent.com/ozarkthedog/civic_lookup/main/data/officials.csv";
    const civicAPIKey = "AIzaSyB3tCnoBkjAFeYCRqy_44xNl1cbvizyXSgY";

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

    async function fetchOfficials(state) {
        const url = `https://www.googleapis.com/civicinfo/v2/representatives?key=${civicAPIKey}&address=${state}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.officials || [];
    }

    async function displayOfficials() {
    const state = stateSelector.value;
    if (!state) return;

    container.innerHTML = "Loading officials...";

    const [csvOfficials, apiOfficials] = await Promise.all([loadCSV(), fetchOfficials(state)]);
    console.log("CSV Officials:", csvOfficials); // Log CSV data
    console.log("API Officials:", apiOfficials); // Log API data

    container.innerHTML = "";

    apiOfficials.forEach(apiOfficial => {
        const csvMatch = csvOfficials.find(o => o.full_name === apiOfficial.name);
        console.log("Matched Official:", csvMatch); // Log matched official
        const partyClass = apiOfficial.party ? apiOfficial.party.toLowerCase().replace(/\s+/g, "-") : "unknown";

        const card = document.createElement("div");
        card.classList.add("official-card");

        card.innerHTML = `
            <img src="${apiOfficial.photoUrl || 'default-image.jpg'}" alt="${apiOfficial.name}">
            <h3>${apiOfficial.name}</h3>
            <p>${csvMatch ? csvMatch.type : "Unknown Title"}</p>
            <div class="party ${partyClass}">${apiOfficial.party}</div>
            <p>State Office: <br><a href="#">${csvMatch ? csvMatch.address : "N/A"}</a></p>
            <p>D.C. Office: <br><a href="#">${csvMatch ? csvMatch.address : "N/A"}</a></p>
            <a href="${csvMatch ? csvMatch.url : '#'}" class="website-btn">Contact on Website</a>
            <button class="call-btn">Call Office</button>
        `;
        container.appendChild(card);
    });
}
