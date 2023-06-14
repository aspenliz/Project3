//call on json data and set up data
d3.json('resources/output.json').then(function(data) {
  var states = [...new Set(data.map(item => item.STATE))];
  var causes = [...new Set(data.map(item => item.CAUSE_NAME))];

//get dropdown menus working
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
//set up functions
function updateChart() {
  var selectedState = d3.select('#stateDropdown').property('value');
  var selectedCause = d3.select('#causeDropdown').property('value');

  d3.json('resources/output.json').then(function(data) {
    var filteredData = data.filter(function(item) {
      return item.STATE === selectedState && item.CAUSE_NAME === selectedCause;
    });

    var years = filteredData.map(item => item.YEAR);
    var deaths = filteredData.map(item => parseInt(item.DEATHS));

    //set up chart container
    var chartContainer = d3.select('#chartContainer');
    chartContainer.html('');

    var svg = chartContainer.append('svg')
      .attr('width', 700)
      .attr('height', 300);

    //set up location of linegraph
    var margin = { top: 60, right: 60, bottom: 70, left: 90 };
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

    //set up chart groups and title
    var chartGroup = svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    chartGroup.append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

    chartGroup.append("text")
    .attr("class", "x-axis-title")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom)
    .text("Year");



    chartGroup.append('g')
      .attr('class', 'y-axis')
      .call(yAxis);


    chartGroup.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 0)
    .attr("dy", ".90em")
    .attr("transform","rotate(-90)")
    .text("Number of Deaths");
  

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
   