
document.addEventListener('DOMContentLoaded', function() {
  // Retrieve the graph container element
  var graphContainer = document.getElementById('graph');

  // Fetch the JSON file
  fetch('resources/output.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(jsonData) {
      // Extract x and y values from the JSON data
      var x_values = jsonData.map(function(entry) {
        return entry.Year;
      });

      var y_values = jsonData.map(function(entry) {
        return entry.Deaths;
      });

      // Create the line graph
      var data = [{
        x: x_values,
        y: y_values,
        type: 'scatter',
        mode: 'lines',
        name: 'Line Graph'
      }];

      var layout = {
        title: 'State Deaths Over Time',
        xaxis: {
          title: 'Year'
        },
        yaxis: {
          title: 'Deaths'
        }
      };

      Plotly.newPlot(graphContainer, data, layout);
    })
    .catch(function(error) {
      console.log('Error fetching JSON file:', error);
    });
});