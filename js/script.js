document.addEventListener("DOMContentLoaded", function () {
    const stateSelector = document.getElementById("stateSelector");
    const container = document.getElementById("officialsContainer");

    function loadOfficials(state) {
        fetch(`https://www.googleapis.com/civicinfo/v2/representatives?key=YOUR_API_KEY&address=${state}`)
            .then(response => response.json())
            .then(data => {
                container.innerHTML = "";
                const officials = data.officials;

                officials.forEach(official => {
                    const card = document.createElement("div");
                    card.classList.add("official-card");

                    card.innerHTML = `
                        <img src="${official.photoUrl || 'default-image.jpg'}" alt="${official.name}">
                        <h3>${official.name}</h3>
                        <p>${official.office}</p>
                        <div class="party ${official.party.toLowerCase()}">${official.party}</div>
                        <a href="${official.urls ? official.urls[0] : '#'}" class="website-btn">Contact on Website</a>
                        <button class="call-btn">Call Office</button>
                    `;
                    container.appendChild(card);
                });
            })
            .catch(error => console.error("Error fetching data:", error));
    }

    stateSelector.addEventListener("change", () => {
        const state = stateSelector.value;
        if (state) loadOfficials(state);
    });
});

