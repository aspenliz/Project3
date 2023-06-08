// Define createMap function
function createMap () {
    // create Leaflet map
    var map = L.map("map").setView([37.8, -96], 3.5);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; OpenStreetMap contributors'
      }).addTo(map);
}
createMap();