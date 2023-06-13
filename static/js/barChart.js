// import data with d3
d3.json("resources/output.json").then(function(data) {
  // Get the unique values for year and state
  var years = Array.from(new Set(data.map(item => item.YEAR)));
  var states = Array.from(new Set(data.map(item => item.STATE)));

  // Create the dropdown menus for year and state
  var yearDropdown = document.getElementById("yearDropdown");
  var stateDropdown = document.getElementById("stateDropdown");

  // Add values to the year dropdown
  years.forEach(year => {
    var option = document.createElement("option");
    option.text = year;
    yearDropdown.add(option);
  });

  // Add values to the state dropdown
  states.forEach(state => {
    var option = document.createElement("option");
    option.text = state;
    stateDropdown.add(option);
  });

  function updateBarGraph() {
    // Get the selected values from the dropdown menus
    var selectedYear = yearDropdown.value;
    var selectedState = stateDropdown.value;
  
    // Filter the data based on the selected values and exclude 'All Causes'
    var filteredData = data.filter(item => item.YEAR === selectedYear && item.STATE === selectedState && item['113_CAUSE_NAME'] !== 'All Causes');
  
    // Extract the necessary data for the bar graph
    var xValues = filteredData.map(item => item['113_CAUSE_NAME']);
    var yValues = filteredData.map(item => parseInt(item.DEATHS));
    var hoverText = filteredData.map(item => `Cause: ${item['113_CAUSE_NAME']}<br>Deaths: ${item.DEATHS}`);
  
    // Create the bar graph with hover box
    var trace = {
      x: xValues,
      y: yValues,
      type: 'bar',
      text: hoverText,  
      hovertemplate: '%{text}',  
    };
  
    var layout = {
      title: 'Number of Deaths by Cause',
      xaxis: {
        title: 'Cause Name'
      },
      yaxis: {
        title: 'Number of Deaths'
      }
    };
  
    var graphData = [trace];
    Plotly.newPlot("barGraph", graphData, layout);
  }
  
  // Attach the updateBarGraph function to the onchange event of the dropdown menus
  yearDropdown.onchange = updateBarGraph;
  stateDropdown.onchange = updateBarGraph;

  
  updateBarGraph();
});

