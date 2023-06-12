// Define variables
var map;
var dropdownYear;
var dropdownCause;
var deathsByState;
var geoJSONLayer;
var selectedCause;

// Create Leaflet map
function createMap() {
  // Initialize the map
  map = L.map("map").setView([37.8, -96], 3.5);

  // Add tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: 'Map data &copy; OpenStreetMap contributors',
  }).addTo(map);

  // Load the GeoJSON data for the states
  d3.json("https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/us-states.json").then(function (geojsonData) {
    // Load the CSV data
    d3.csv("resources/NCHS_-_Leading_Causes_of_Death__United_States (1).csv").then(function (csvData) {
      // Get unique years from the CSV data
      var years = [...new Set(csvData.map((d) => d.Year))];

      // Get unique causes of death from the CSV data
      var causes = [...new Set(csvData.map((d) => d["113 Cause Name"]))];

      // Create dropdown menu for years
      dropdownYear = document.getElementById("yearDropdown");
      years.sort().reverse(); 
      years.forEach(function (year) {
        var option = document.createElement("option");
        option.value = year;
        option.text = year;
        dropdownYear.appendChild(option);
      });

      // Create dropdown menu for causes of death
      dropdownCause = document.getElementById("causeDropdown");
      causes.forEach(function (cause) {
        var option = document.createElement("option");
        option.value = cause;
        option.text = cause;
        dropdownCause.appendChild(option);
      });

      // Function to update the map based on the selected year and cause of death
      function updateMap() {
        // Get the selected year and cause of death
        var selectedYear = dropdownYear.value;
        selectedCause = dropdownCause.value;

        // Close all open popups
        map.closePopup();
        
        // Filter the CSV data for the selected year and cause of death
        var filteredData = csvData.filter(function (d) {
          return d.Year === selectedYear && d["113 Cause Name"] === selectedCause;
        });

        // Reset the deathsByState object
        deathsByState = {};

        // Calculate the number of deaths for each state
        filteredData.forEach(function (d) {
          var state = d.State;
          // Convert number of deaths to integer
          var deaths = parseInt(d.Deaths.replace(/,/g, ""));

          // Create empty object if deathsByState lacks state data
          if (!deathsByState[state]) {
            deathsByState[state] = {};
          }
          // The code finds death by state based on the state and cause of death selected
          deathsByState[state][selectedCause] = deaths;
        });
      }

      // Create initial map
      updateMap();

      // Event listeners for dropdown selection change
      dropdownYear.addEventListener("change", updateMap);
      dropdownCause.addEventListener("change", updateMap);

      // Create GeoJSON layer and add it to the map
      geoJSONLayer = L.geoJSON(geojsonData, {
        onEachFeature: function (feature, layer) {
          layer.on({
            click: function (e) {
              var state = e.target.feature.properties.name;
              var deaths =
                // Check if the state and cause selected have a number of deaths connected to them
                deathsByState[state] && deathsByState[state][selectedCause]
                  ? deathsByState[state][selectedCause]
                  // If there is no number of deaths connected to selected state and cause of death, set number of deaths to zero
                  : 0;

              // Format popup
              var popupContent = "State: " + state + "<br>" + "Deaths: " + deaths;

              layer.bindPopup(popupContent).openPopup();
            },
          });
        },
      }).addTo(map);
    });
  });
}

createMap();
