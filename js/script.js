document.addEventListener("DOMContentLoaded", function () {
    const stateSelector = document.getElementById("stateSelector");
    const container = document.getElementById("officialsContainer");

    function loadCSV() {
        // Make sure the URL matches your GitHub Pages URL
        const csvURL = "https://raw.githubusercontent.com/ozarkthedog/civic-lookup/main/data/officials.csv";


        fetch(csvURL)
            .then(response => response.text())
            .then(csvText => {
                Papa.parse(csvText, {
                    header: true, // Automatically convert rows into objects
                    skipEmptyLines: true,
                    complete: function (results) {
                        const officialsData = results.data;
                        setupDropdown(officialsData); // Populate dropdown
                        stateSelector.addEventListener("change", () => displayOfficials(officialsData));
                    }
                });
            })
            .catch(error => console.error("Error loading CSV:", error));
    }

    function setupDropdown(officials) {
        const states = [...new Set(officials.map(official => official.state))]; // Get unique states
        stateSelector.innerHTML = '<option value="">Select your state</option>'; // Reset dropdown
        states.forEach(state => {
            stateSelector.innerHTML += `<option value="${state}">${state}</option>`;
        });
    }

    function displayOfficials(officials) {
        const state = stateSelector.value;
        container.innerHTML = ""; // Clear previous results

        if (!state) return;

        const filteredOfficials = officials.filter(official => official.state === state);
        if (filteredOfficials.length === 0) {
            container.innerHTML = "<p>No officials found for this state.</p>";
            return;
        }

        filteredOfficials.forEach(official => {
            const card = document.createElement("div");
            card.classList.add("official-card");

            card.innerHTML = `
                <div class="official-header">
                    <div class="official-img"></div>
                    <div class="official-info">
                        <h3>${official.name}</h3>
                        <p class="title">${official.title}</p>
                        <div class="party ${official.party.toLowerCase()}">${official.party}</div>
                    </div>
                </div>

                <div class="office-info">
                    <p><span>In office since</span> <span>${official.inOfficeSince}</span></p>
                    <p><span>Seat up</span> <span>${official.seatUp}</span></p>
                    <p class="address">
                        <span>Address</span>
                        <span>${official.address.replaceAll(",", "<br>")}</span>
                    </p>
                </div>

                <a href="${official.website}" class="website-btn" target="_blank">Website</a>
                <button class="call-btn">Call Office</button>

                <div class="social-icons">
                    <a href="#"><img src="assets/instagram.svg" alt="Instagram"></a>
                    <a href="#"><img src="assets/twitter.svg" alt="Twitter"></a>
                    <a href="#"><img src="assets/facebook.svg" alt="Facebook"></a>
                </div>
            `;
            container.appendChild(card);
        });
    }

    loadCSV();
});

