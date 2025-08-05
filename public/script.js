let autocomplete;

function initAutocomplete() {
  fetch('/api/maps-key')
    .then(res => res.json())
    .then(data => {
      const input = document.getElementById("address");
      autocomplete = new google.maps.places.Autocomplete(input, {
        componentRestrictions: { country: "au" },
        fields: ["formatted_address", "geometry"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          alert("Please select a valid address from suggestions.");
        }
      });
    })
    .catch(err => {
      console.error("Failed to load Google Maps key:", err);
      alert("Maps failed to load. Check console and API key.");
    });
}

document.getElementById("propertyForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const address = document.getElementById("address").value;
  const action = document.getElementById("action").value;

  if (!address || !action) {
    alert("Please fill in both address and action.");
    return;
  }

  // Clear previous result
  document.getElementById("price").textContent = "$---";
  document.getElementById("builtYear").textContent = "---";
  document.getElementById("areaRating").textContent = "---";
  document.getElementById("recommended").textContent = "Processing...";

  try {
    const res = await fetch("/advice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, action }),
    });

    const data = await res.json();

    if (!data.response || res.status !== 200) {
      throw new Error("No valid response from server.");
    }

    const response = data.response;

    // Basic parsing (if response format is known)
    const priceMatch = response.match(/\$\s?[\d,]+/);
    const yearMatch = response.match(/(?:Built|Year)[^\d]*(\d{4})/i);
    const ratingMatch = response.match(/area (rating|score)[^\d]*(\d(?:\.\d)?)/i);
    const adviceMatch = response.match(/Recommended action: (.+)/i);

    document.getElementById("price").textContent = priceMatch ? priceMatch[0] : "$---";
    document.getElementById("builtYear").textContent = yearMatch ? yearMatch[1] : "---";
    document.getElementById("areaRating").textContent = ratingMatch ? ratingMatch[2] : "---";
    document.getElementById("recommended").textContent = adviceMatch
      ? adviceMatch[1]
      : response;
  } catch (err) {
    console.error("Advice fetch failed:", err);
    document.getElementById("recommended").textContent = "Something went wrong.";
  }
});
