document.getElementById("stateSelector").addEventListener("change", function() {
    const state = this.value;
    const container = document.getElementById("officialsContainer");
    container.innerHTML = ""; // Clear previous results

    // Fetch the data
    fetch("data/officials.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load data");
            }
            return response.json();
        })
        .then(data => {
            const officials = data[state] || [];
            if (officials.length === 0) {
                container.innerHTML = "<p>No officials found for this state.</p>";
                return;
            }

            officials.forEach(official => {
                const card = document.createElement("div");
                card.classList.add("official-card");

                card.innerHTML = `
                    <div class="official-info">
                        <div class="official-img"></div>
                        <h3>${official.name}</h3>
                        <p>${official.title}</p>
                        <span class="party ${official.party.toLowerCase()}">${official.party}</span>
                        <p><strong>In office since:</strong> ${official.inOfficeSince}</p>
                        <p><strong>Seat up:</strong> ${official.seatUp}</p>
                        <p><strong>Address:</strong> ${official.address}</p>
                        <a href="${official.website}" class="website-btn">Website</a>
                        <button class="call-btn">Call Office</button>
                        <div class="social-icons">
                            <a href="#"><img src="assets/instagram.svg" alt="Instagram"></a>
                            <a href="#"><img src="assets/twitter.svg" alt="Twitter"></a>
                            <a href="#"><img src="assets/facebook.svg" alt="Facebook"></a>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
        })
        .catch(error => console.error("Error loading officials:", error));
});

