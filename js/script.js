document.addEventListener("DOMContentLoaded", function () {
    const stateSelector = document.getElementById("stateSelector");
    const container = document.getElementById("officialsContainer");

    stateSelector.addEventListener("change", function () {
        const state = this.value;
        container.innerHTML = ""; // Clear previous results

        if (!state) return;

        fetch("data/officials.json")
            .then(response => response.json())
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
                        <div class="official-img"></div>
                        <h3>${official.name}</h3>
                        <p class="title">${official.title}</p>
                        <div class="party ${official.party.toLowerCase()}">${official.party}</div>

                        <div class="office-info">
                            <p><strong>In office since:</strong> <span>${official.inOfficeSince}</span></p>
                            <p><strong>Seat up:</strong> <span>${official.seatUp}</span></p>
                            <p><strong>Address:</strong> <span>${official.address}</span></p>
                        </div>

                        <a href="${official.website}" class="website-btn">Website</a>
                        <button class="call-btn">Call Office</button>

                        <div class="social-icons">
                            <a href="#"><img src="assets/instagram.svg" alt="Instagram"></a>
                            <a href="#"><img src="assets/twitter.svg" alt="Twitter"></a>
                            <a href="#"><img src="assets/facebook.svg" alt="Facebook"></a>
                        </div>
                    `;
                    container.appendChild(card);
                });
            })
            .catch(error => console.error("Error loading officials:", error));
    });
});

