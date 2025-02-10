document.addEventListener("DOMContentLoaded", async function () {
    const stateSelector = document.getElementById("stateSelector");
    const container = document.getElementById("officialsContainer");
    container.style.display = "none"; // Hide container initially
    
    const currentLegislatorsURL = "https://unitedstates.github.io/congress-legislators/legislators-current.json";
    const socialMediaURL = "https://unitedstates.github.io/congress-legislators/legislators-social-media.json";

    async function fetchJSON(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to load: ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error("Error fetching JSON:", error);
            return [];
        }
    }

    async function loadLegislators() {
        const [legislators, socialMedia] = await Promise.all([
            fetchJSON(currentLegislatorsURL),
            fetchJSON(socialMediaURL)
        ]);
        
        const socialMediaMap = {};
        socialMedia.forEach(entry => {
            if (entry.id.bioguide) {
                socialMediaMap[entry.id.bioguide] = entry.social;
            }
        });

        return legislators.map(legislator => {
            const latestTerm = legislator.terms[legislator.terms.length - 1];
            return {
                id: legislator.id.bioguide,
                fullName: `${legislator.name.first} ${legislator.name.last}`,
                state: latestTerm.state,
                chamber: latestTerm.type === "sen" ? "Senate" : "House",
                party: latestTerm.party,
                district: latestTerm.district || "N/A",
                startDate: latestTerm.start || "Unknown",
                endDate: latestTerm.end || "Unknown",
                phone: latestTerm.phone || "N/A",
                office: latestTerm.office || "N/A",
                website: latestTerm.url || "N/A",
                twitter: socialMediaMap[legislator.id.bioguide]?.twitter || "",
                facebook: socialMediaMap[legislator.id.bioguide]?.facebook || "",
                instagram: socialMediaMap[legislator.id.bioguide]?.instagram || ""
            };
        });
    }

    async function displayOfficials() {
        const state = stateSelector.value.trim().toUpperCase();
        if (!state) return;

        container.style.display = "block"; // Show container when state is selected
        container.innerHTML = "Loading officials...";
        const legislators = await loadLegislators();
        const filteredOfficials = legislators.filter(official => official.state === state);
        
        container.innerHTML = "";
        
        if (filteredOfficials.length === 0) {
            container.innerHTML = "<p>No officials found for this state.</p>";
            return;
        }

        filteredOfficials.forEach(official => {
            const card = document.createElement("div");
            card.classList.add("official-card");
            
            card.innerHTML = `
                <h3>${official.fullName}</h3>
                <p><strong>${official.chamber}</strong> | ${official.party}</p>
                <p>📍 District: ${official.district}</p>
                <p>📅 In Office: ${official.startDate} - ${official.endDate}</p>
                <p>📞 <a href="tel:${official.phone}">${official.phone}</a></p>
                <p>🏛️ Office: ${official.office}</p>
                <p><a href="${official.website}" target="_blank" class="website-btn">Official Website</a></p>
                <div class="social-links">
                    ${official.twitter ? `<a href="https://twitter.com/${official.twitter}" target="_blank">🐦 Twitter</a>` : ""}
                    ${official.facebook ? `<a href="https://facebook.com/${official.facebook}" target="_blank">📘 Facebook</a>` : ""}
                    ${official.instagram ? `<a href="https://instagram.com/${official.instagram}" target="_blank">📸 Instagram</a>` : ""}
                    
                </div>
            `;
            container.appendChild(card);
        });
    }

    stateSelector.addEventListener("change", displayOfficials);
});
Selector.addEventListener("change", displayOfficials);
});
