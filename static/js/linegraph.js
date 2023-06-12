document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the graph container element
    var graphContainer = document.getElementById('graph');
  
    // Fetch the CSV file
    fetch('file:///C:/Users/aspen/osu/homework/Project3/resources/leading_cause_death.csv')
      .then(function(response) {
        return response.text();
      })
      .then(function(csvData) {
        // Parse the CSV data
        var parsedData = parseCSV(csvData);
  
        // Extract x and y values from the parsed data
        var x_values = Year.x;
        var y_values = Death.y;
  
        // Create the line graph
        var data = [{
          x: x_values,
          y: y_values,
          type: 'scatter',
          mode: 'lines',
          name: 'Deaths by State Over Time'
        }];
  
        var layout = {
          title: 'Deaths by State Over Time',
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
        console.log('Error fetching CSV file:', error);
      });
  
    // Function to parse CSV data
    function parseCSV(csvData) {
      // Split CSV data into rows
      var rows = csvData.trim().split('\n');
      
      // Extract column headers
      var headers = rows[0].split(',');
  
      // Initialize empty arrays for each column
      var columns = {};
      headers.forEach(function(header) {
        columns[header] = [];
      });
  
      // Parse data for each row
      for (var i = 1; i < rows.length; i++) {
        var values = rows[i].split(',');
  
        // Add values to respective columns
        headers.forEach(function(header, index) {
          columns[header].push(values[index]);
        });
      }
  
      return columns;
    }
  });
  