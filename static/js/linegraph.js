d3.json('resources/output.json').then(function(data) {
  var states = [...new Set(data.map(item => item.STATE))];
  var causes = [...new Set(data.map(item => item.CAUSE_NAME))];

  var stateDropdown = d3.select('#stateDropdown');
  states.forEach(function(state) {
    stateDropdown.append('option').attr('value', state).text(state);
  });

  var causeDropdown = d3.select('#causeDropdown');
  causes.forEach(function(cause) {
    causeDropdown.append('option').attr('value', cause).text(cause);
  });

  stateDropdown.on('change', updateChart);
  causeDropdown.on('change', updateChart);

  // Initialize the chart
  updateChart();
});

function updateChart() {
  var selectedState = d3.select('#stateDropdown').property('value');
  var selectedCause = d3.select('#causeDropdown').property('value');

  d3.json('resources/output.json').then(function(data) {
    var filteredData = data.filter(function(item) {
      return item.STATE === selectedState && item.CAUSE_NAME === selectedCause;
    });

    var years = filteredData.map(item => item.YEAR);
    var deaths = filteredData.map(item => parseInt(item.DEATHS));

    var chartContainer = d3.select('#chartContainer');
    chartContainer.html('');

    var svg = chartContainer.append('svg')
      .attr('width', 500)
      .attr('height', 300);

    var margin = { top: 20, right: 20, bottom: 30, left: 50 };
    var width = +svg.attr('width') - margin.left - margin.right;
    var height = +svg.attr('height') - margin.top - margin.bottom;

    var xScale = d3.scaleBand()
      .domain(years)
      .range([0, width])
      .padding(0.1);

    var yScale = d3.scaleLinear()
      .domain([0, d3.max(deaths)])
      .range([height, 0]);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    var chartGroup = svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    chartGroup.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    chartGroup.append('g')
      .attr('class', 'y-axis')
      .call(yAxis);

    var line = d3.line()
      .x(function(d) { return xScale(d.YEAR) + xScale.bandwidth() / 2; })
      .y(function(d) { return yScale(d.DEATHS); });

    chartGroup.append('path')
      .datum(filteredData)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line);
  });
}

// Call the updateChart function when the page loads
updateChart();
   