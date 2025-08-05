function initAutocomplete() {
    const input = document.getElementById("address");
    const autocomplete = new google.maps.places.Autocomplete(input, {
      types: ['address'],
      componentRestrictions: { country: 'au' }
    });
  }
  
  document.getElementById('property-form').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const address = document.getElementById('address').value;
    const action = document.getElementById('action').value;
  
    // Mock data for display purposes
    document.getElementById('price').textContent = "$720,000";
    document.getElementById('builtYear').textContent = "2010";
    document.getElementById('rating').textContent = "8.5/10";
    document.getElementById('advice').textContent = `Recommended to ${action.toUpperCase()}`;
  });
  