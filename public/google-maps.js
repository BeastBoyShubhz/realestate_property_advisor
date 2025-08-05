// google-maps.js
fetch('/api/maps-key')
  .then(res => res.json())
  .then(data => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${data.key}&libraries=places&callback=initAutocomplete`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  });
