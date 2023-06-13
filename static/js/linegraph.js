fetch('resources/output.json')
  .then(response => response.json())
  .then(data => {
    const parsedData = data;
    const states = [...new Set(parsedData.map(entry => entry.STATE))];
    const causes = [...new Set(parsedData.map(entry => entry.CAUSE_NAME))];
    const years = [...new Set(parsedData.map(entry => entry.YEAR))];
    const deaths = [...new Set(parsedData.map(entry => entry.DEATHS))];
    const chartData = {};

    const stateSelect = document.getElementById('state-select');
    const causeSelect = document.getElementById('cause-select');
  
    // Populate State dropdown menu
    states.forEach(state => {
      const option = document.createElement('option');
      option.value = state;
      option.text = state;
      stateSelect.appendChild(option);
    });

    // Populate Cause dropdown menu
    causes.forEach(cause => {
      const option = document.createElement('option');
      option.value = cause;
      option.text = cause;
      causeSelect.appendChild(option);
    });

    const canvas = document.getElementById('chart-canvas');
    const ctx = canvas.getContext('2d');

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: years, 
        datasets: []
       
      },
      options: {
        responsive: true,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Year'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Deaths'
            }
          }
        }
      }
    });

    // Event listeners for dropdown changes
    stateSelect.addEventListener('change', function() {
      const selectedState = stateSelect.value;
      updateChartData(selectedState, chartData, causeSelect.value);
      updateChart(chartData, chart);
    });

    causeSelect.addEventListener('change', function() {
      const selectedCause = causeSelect.value;
      updateChartData(stateSelect.value, chartData, selectedCause);
      updateChart(chartData, chart);
    });

    function updateChartData(selectedState, chartData, selectedCause) {
      chartData.datasets = [];
      years.forEach(year => {
        const filteredData = parsedData.filter(entry => entry.state === selectedState && entry.CAUSE_NAME === selectedCause && entry.year === year);
        const totalDeaths = filteredData.reduce((acc, entry) => acc + entry.deaths, 0);
        chartData.datasets.push({ year, deaths: totalDeaths });
      });
    }

    function updateChart(chartData, chart) {
      const chartLabels = chartData.datasets.map(dataset => dataset.year);
      const chartDeaths = chartData.datasets.map(dataset => dataset.deaths);

      chart.data.labels = chartLabels;
      chart.data.datasets[0] = {
        label: 'Cause of Death Overtime for Each State',
        data: chartDeaths,
        borderColor: 'blue',
        fill: false
      };
      // Set y-axis title dynamically based on selected cause
      chart.options.scales.y.title.text = causeSelect.value;
      chart.update();
    }

    chart.update();
  });
   