// Define createMap function
function createMap() {
    // create Leaflet map
    var map = L.map("map").setView([37.8, -96], 3.5);
  
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; OpenStreetMap contributors'
    }).addTo(map);
  
    // Load the GeoJSON data for the states
    d3.json("https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/us-states.json").then(function (data) {
      // Add GeoJSON layer to map
      var geoJSONLayer = L.geoJSON(data, {
        onEachFeature: onEachFeature
      });
      geoJSONLayer.addTo(map);
    });
  
    function onEachFeature(feature, layer) {
      layer.on('click', function (event) {
        var stateName = feature.properties.name;
        openPopup(layer, "State: " + stateName);
      });
    }
  
    function openPopup(layer, content) {
      // Close any existing popups
      map.closePopup();
  
      // Create a custom popup
      var popup = L.popup()
        .setContent(content)
        .setLatLng(layer.getBounds().getCenter())
        .openOn(map);
    }
  }
  
  createMap();
