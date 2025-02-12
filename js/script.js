document.addEventListener("DOMContentLoaded", async function () {
  const stateSelector = document.getElementById("stateSelector");
  const container = document.getElementById("officialsContainer");
  container.style.display = "none"; // Hide container initially

  const currentLegislatorsURL =
    "https://unitedstates.github.io/congress-legislators/legislators-current.json";
  const socialMediaURL =
    "https://unitedstates.github.io/congress-legislators/legislators-social-media.json";

  async function fetchJSON(url) {
    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`Failed to load: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching JSON:", error);
      return [];
    }
  }

  async function loadLegislators() {
    const [legislators, socialMedia] = await Promise.all([
      fetchJSON(currentLegislatorsURL),
      fetchJSON(socialMediaURL),
    ]);

    const socialMediaMap = {};
    socialMedia.forEach((entry) => {
      if (entry.id.bioguide) {
        socialMediaMap[entry.id.bioguide] = entry.social;
      }
    });

    return legislators.map((legislator) => {
      const latestTerm = legislator.terms[legislator.terms.length - 1];
      return {
        id: legislator.id.bioguide,
        fullName: `${legislator.name.first} ${legislator.name.last}`,
        state: latestTerm.state,
        chamber: latestTerm.type === "sen" ? "Senator" : "Representative",
        party: latestTerm.party,
        district: latestTerm.district || "N/A",
        startDate: latestTerm.start || "Unknown",
        endDate: latestTerm.end || "Unknown",
        phone: latestTerm.phone || "N/A",
        office: latestTerm.office || "N/A",
        website: latestTerm.url || "N/A",
        twitter: socialMediaMap[legislator.id.bioguide]?.twitter || "",
        facebook: socialMediaMap[legislator.id.bioguide]?.facebook || "",
        instagram: socialMediaMap[legislator.id.bioguide]?.instagram || "",
        youtube: socialMediaMap[legislator.id.bioguide]?.youtube || "",
      };
    });
  }

  // Helper function to format dates as "Month Day, Year"
  function formatDate(dateString) {
    if (dateString === "Unknown") return dateString;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  async function displayOfficials() {
    const state = stateSelector.value.trim().toUpperCase();
    if (!state) return;

    container.style.display = "block"; // Show container when state is selected
    container.innerHTML = "Loading officials...";
    container.style.display = "grid"; // Ensure it remains a grid
    container.style.gridTemplateColumns =
      "repeat(auto-fit, minmax(250px, 1fr))";
    container.style.gap = "20px";

    const legislators = await loadLegislators();
    const filteredOfficials = legislators.filter(
      (official) => official.state === state
    );

    // Sort officials: Senate first, then House by district
    filteredOfficials.sort((a, b) => {
      if (a.chamber === "Senator" && b.chamber !== "Senator") return -1;
      if (b.chamber === "Senator" && a.chamber !== "Senator") return 1;
      if (a.chamber === "Representative" && b.chamber === "Representative") {
        return a.district - b.district; // Sort House members by district
      }
      return 0;
    });

    container.innerHTML = "";

    if (filteredOfficials.length === 0) {
      container.innerHTML = "<p>No officials found for this state.</p>";
      return;
    }

    filteredOfficials.forEach((official) => {
      const card = document.createElement("div");
      card.classList.add("official-card");

      // Construct the photo URL using the bioguide ID
      const bioguide = official.id; // bioguide ID is already in the data
      const photoUrl = `https://bioguide.congress.gov/bioguide/photo/${bioguide[0]}/${bioguide}.jpg`;

      // Conditionally include the District line only for Representatives
      const districtLine =
        official.chamber === "Representative"
          ? `<p class="official-district">District ${official.district}</p>`
          : "";

      // Format the start and end dates
      const startDate = formatDate(official.startDate);
      const endDate = formatDate(official.endDate);

      // Add the photo and other details to the card
      card.innerHTML = `
          <div class="card-content">
              <img src="${photoUrl}" alt="${
        official.fullName
      }" class="official-photo">
              <h3 class="official-name">${official.fullName}</h3>
              <p class="official-chamber">${official.chamber}</p>
              ${districtLine}
              <p class="party ${official.party.toLowerCase()}">${
        official.party
      }</p>
              <p class="in-office-label">In Office</p>
              <p class="in-office-dates">${startDate}<br>-<br> ${endDate}</p>
              <p class="office-address-label">Office Address</p>
              <p class="office-address">${official.office}</p>
              <div class="social-links">
                  ${
                    official.twitter
                      ? `<a href="https://twitter.com/${official.twitter}" target="_blank"><img src="https://raw.githubusercontent.com/ozarkthedog/civic-lookup/main/assets/icons/Twitter.svg" alt="Twitter" class="social-icon"></a>`
                      : ""
                  }
                  ${
                    official.facebook
                      ? `<a href="https://facebook.com/${official.facebook}" target="_blank"><img src="https://raw.githubusercontent.com/ozarkthedog/civic-lookup/main/assets/icons/Facebook.svg" alt="Facebook" class="social-icon"></a>`
                      : ""
                  }
                  ${
                    official.instagram
                      ? `<a href="https://instagram.com/${official.instagram}" target="_blank"><img src="https://raw.githubusercontent.com/ozarkthedog/civic-lookup/main/assets/icons/Instagram.svg" alt="Instagram" class="social-icon"></a>`
                      : ""
                  }
              </div>
          </div>
          <div class="button-container">
              <a href="${
                official.website
              }" target="_blank" class="website-btn">Contact on Website</a>
              <a href="tel:${official.phone}" class="call-btn">Call Office<br>${
        official.phone
      }</a>
          </div>
        `;
      container.appendChild(card);
    });

    // Show the scripts section after cards are displayed
    const scriptsSection = document.getElementById("scripts-section");
    scriptsSection.style.display = "block";
  }

  stateSelector.addEventListener("change", displayOfficials);
});

