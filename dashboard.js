$(function() {

  $('#carbonFootPrintTable').DataTable({
    pagingType: 'full_numbers',
    order: [[0, 'desc']],
    lengthChange: false,
    bPaginate: false,
    info: false,
    searching: false,
    "aoColumnDefs": [
        { "bSortable": false, "aTargets": [ 3, 4 ] },
        { "bSearchable": false, "aTargets": [ 3, 4 ] }
    ]
  });

  // Supplier Charts/Graphs start
  if ($('body').has("#chartData").length) {
    var chartData = JSON.parse($("#chartData").text());
    var scope_1 = chartData.total_count.scope_1;
    var scope_2 = chartData.total_count.scope_2;
    var scope_3 = chartData.total_count.scope_3;
    var transport = chartData.total_count.transport;

    var customer_averages = chartData.customer_average;
    var customer_names = [];
    var customer_scope1_avgs = [];
    var customer_scope2_avgs = [];
    var customer_scope3_avgs = [];
    var customer_transport_avgs = [];
    var customer_total_avgs = [];
    $.each(customer_averages, function(key, value) {
      customer_names.push(value.company_name);
      customer_scope1_avgs.push(value.scope_1);
      customer_scope2_avgs.push(value.scope_2);
      customer_scope3_avgs.push(value.scope_3);
      customer_transport_avgs.push(value.transport);
      customer_total_avgs.push(value.total_average);
    })

    var parts_averages = chartData.parts_average;
    var part_numbers = [];
    var part_scope1_avgs = [];
    var part_scope2_avgs = [];
    var part_scope3_avgs = [];
    var part_transport_avgs = [];
    var part_total_avgs = [];
    $.each(parts_averages, function(key, value) {
      part_numbers.push(value.part_number);
      part_scope1_avgs.push(value.scope_1);
      part_scope2_avgs.push(value.scope_2);
      part_scope3_avgs.push(value.scope_3);
      part_transport_avgs.push(value.transport);
      part_total_avgs.push(value.total_average);
    })

    var footprintPieData = {
      datasets: [{
        data: [scope_1, scope_2, scope_3, transport],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 159, 64, 0.8)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)'
        ],
      }],

      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: [
        'Scope 1',
        'Scope 2',
        'Scope 3',
        'Transportation'
      ]
    };
    var footprintPieOptions = {
      responsive: true,
      animation: {
        animateScale: true,
        animateRotate: true
      },
      plugins: {
        legend: false,
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            var dataset = data.datasets[tooltipItem.datasetIndex];
            var meta = dataset._meta[Object.keys(dataset._meta)[0]];
            var total = meta.total;
            var currentValue = dataset.data[tooltipItem.index];
            var percentage = parseFloat((currentValue/total*100).toFixed(1));
            return currentValue + ' (' + percentage + '%)';
          },
          title: function(tooltipItem, data) {
            return data.labels[tooltipItem[0].index];
          }
        }
      }
    };

    if ($("#footprintPieChart").length) {
      var footprintPieChartCanvas = $("#footprintPieChart").get(0).getContext("2d");
      var pieChart = new Chart(footprintPieChartCanvas, {
        type: 'pie',
        data: footprintPieData,
        options: footprintPieOptions
      });
    }

    if ($("#customer-average-chart").length) {
      var CustomerAverageChartCanvas = $("#customer-average-chart").get(0).getContext("2d");
      var CustomerAverageChart = new Chart(CustomerAverageChartCanvas, {
        type: 'bar',
        data: {
          labels: customer_names,
          datasets: [{
            label: 'Average of Scope1',
            data: customer_scope1_avgs,
            backgroundColor: 'rgba(255, 99, 132, 0.8)'
          }, {
            label: 'Average of Scope2',
            data: customer_scope2_avgs,
            backgroundColor: 'rgba(54, 162, 235, 0.8)'
          }, {
            label: 'Average of Scope3',
            data: customer_scope3_avgs,
            backgroundColor: 'rgba(255, 206, 86, 0.8)'
          }, {
            label: 'Average of Transportation',
            data: customer_transport_avgs,
            backgroundColor: 'rgba(153, 102, 255, 0.8)'
          }]
        },
        options: {
          cornerRadius: 5,
          responsive: true,
          maintainAspectRatio: true,
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 20,
              bottom: 0
            }
          },
          scales: {
            yAxes: [{
              display: true,
              stacked: true,
              gridLines: {
                display: true,
                drawBorder: false,
                color: "#F2F2F2"
              },
              scaleLabel: {
                display: true,
                labelString: 'kg co2 per part'
              },
              ticks: {
                display: true,
                min: 0,
                max: (customer_total_avgs.length > 0) ? Math.ceil(Math.max.apply(Math, customer_total_avgs) + 1) : 5,
                callback: function(value, index, values) {
                  return parseFloat(value).toFixed(2);
                },
                autoSkip: true,
                maxTicksLimit: 10,
                fontColor:"#6C7383"
              }
            }],
            xAxes: [{
              stacked: true,
              ticks: {
                beginAtZero: true,
                fontColor: "#6C7383"
              },
              scaleLabel: {
                display: true,
                labelString: 'Customer Name'
              },
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
                display: false
              },
              barPercentage: 1
            }]
          },
          legend: {
            display: false
          },
          elements: {
            point: {
              radius: 0
            }
          }
        },
      });
      document.getElementById('customer-average-legend').innerHTML = CustomerAverageChart.generateLegend();
    }

    if ($("#part-average-chart").length) {
      var PartAverageChartCanvas = $("#part-average-chart").get(0).getContext("2d");
      var PartAverageChart = new Chart(PartAverageChartCanvas, {
        type: 'bar',
        data: {
          labels: part_numbers,
          datasets: [{
            label: 'Average of Scope1',
            data: part_scope1_avgs,
            backgroundColor: 'rgba(255, 99, 132, 0.8)'
          }, {
            label: 'Average of Scope2',
            data: part_scope2_avgs,
            backgroundColor: 'rgba(54, 162, 235, 0.8)'
          }, {
            label: 'Average of Scope3',
            data: part_scope3_avgs,
            backgroundColor: 'rgba(255, 206, 86, 0.8)'
          }, {
            label: 'Average of Transportation',
            data: part_transport_avgs,
            backgroundColor: 'rgba(153, 102, 255, 0.8)'
          }]
        },
        options: {
          cornerRadius: 5,
          responsive: true,
          maintainAspectRatio: true,
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 20,
              bottom: 0
            }
          },
          scales: {
            yAxes: [{
              display: true,
              stacked: true,
              gridLines: {
                display: true,
                drawBorder: false,
                color: "#F2F2F2"
              },
              scaleLabel: {
                display: true,
                labelString: 'kg co2 per part'
              },
              ticks: {
                display: true,
                min: 0,
                max: (part_total_avgs.length > 0) ? Math.ceil(Math.max.apply(Math, part_total_avgs) + 1) : 5,
                callback: function(value, index, values) {
                  return parseFloat(value).toFixed(2);
                },
                autoSkip: true,
                maxTicksLimit: 10,
                fontColor:"#6C7383"
              }
            }],
            xAxes: [{
              stacked: true,
              ticks: {
                beginAtZero: true,
                fontColor: "#6C7383"
              },
              scaleLabel: {
                display: true,
                labelString: 'Part No.'
              },
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
                display: false
              },
              barPercentage: 1
            }]
          },
          legend: {
            display: false
          },
          elements: {
            point: {
              radius: 0
            }
          }
        },
      });
      document.getElementById('part-average-legend').innerHTML = PartAverageChart.generateLegend();
    }
  }
  // Supplier Charts/Graphs end

  // Customer Charts/Graphs start
  if ($('body').has("#customerChartData").length) {
    var chartData = JSON.parse($("#customerChartData").text());
    var scope_1 = chartData.total_count.scope_1;
    var scope_2 = chartData.total_count.scope_2;
    var scope_3 = chartData.total_count.scope_3;
    var transport = chartData.total_count.transport;

    var supplier_averages = chartData.supplier_average;
    var supplier_names = [];
    var supplier_scope1_avgs = [];
    var supplier_scope2_avgs = [];
    var supplier_scope3_avgs = [];
    var supplier_transport_avgs = [];
    var supplier_total_avgs = [];
    $.each(supplier_averages, function(key, value) {
      supplier_names.push(value.supplier_name);
      supplier_scope1_avgs.push(value.scope_1);
      supplier_scope2_avgs.push(value.scope_2);
      supplier_scope3_avgs.push(value.scope_3);
      supplier_transport_avgs.push(value.transport);
      supplier_total_avgs.push(value.total_average);
    })

    var parts_averages = chartData.parts_average;
    var part_numbers = [];
    var part_scope1_avgs = [];
    var part_scope2_avgs = [];
    var part_scope3_avgs = [];
    var part_transport_avgs = [];
    var part_total_avgs = [];
    $.each(parts_averages, function(key, value) {
      part_numbers.push(value.part_number);
      part_scope1_avgs.push(value.scope_1);
      part_scope2_avgs.push(value.scope_2);
      part_scope3_avgs.push(value.scope_3);
      part_transport_avgs.push(value.transport);
      part_total_avgs.push(value.total_average);
    })

    var footprintPieData = {
      datasets: [{
        data: [scope_1, scope_2, scope_3, transport],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 159, 64, 0.8)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)'
        ],
      }],

      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: [
        'Scope 1',
        'Scope 2',
        'Scope 3',
        'Transportation'
      ]
    };
    var footprintPieOptions = {
      responsive: true,
      animation: {
        animateScale: true,
        animateRotate: true
      },
      plugins: {
        legend: false,
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            var dataset = data.datasets[tooltipItem.datasetIndex];
            var meta = dataset._meta[Object.keys(dataset._meta)[0]];
            var total = meta.total;
            var currentValue = dataset.data[tooltipItem.index];
            var percentage = parseFloat((currentValue/total*100).toFixed(1));
            return currentValue + ' (' + percentage + '%)';
          },
          title: function(tooltipItem, data) {
            return data.labels[tooltipItem[0].index];
          }
        }
      }
    };

    if ($("#customerFootprintPieChart").length) {
      var footprintPieChartCanvas = $("#customerFootprintPieChart").get(0).getContext("2d");
      var pieChart = new Chart(footprintPieChartCanvas, {
        type: 'pie',
        data: footprintPieData,
        options: footprintPieOptions
      });
    }

    if ($("#supplier-average-chart").length) {
      var SupplierAverageChartCanvas = $("#supplier-average-chart").get(0).getContext("2d");
      var SupplierAverageChart = new Chart(SupplierAverageChartCanvas, {
        type: 'bar',
        data: {
          labels: supplier_names,
          datasets: [{
            label: 'Average of Scope1',
            data: supplier_scope1_avgs,
            backgroundColor: 'rgba(255, 99, 132, 0.8)'
          }, {
            label: 'Average of Scope2',
            data: supplier_scope2_avgs,
            backgroundColor: 'rgba(54, 162, 235, 0.8)'
          }, {
            label: 'Average of Scope3',
            data: supplier_scope3_avgs,
            backgroundColor: 'rgba(255, 206, 86, 0.8)'
          }, {
            label: 'Average of Transportation',
            data: supplier_transport_avgs,
            backgroundColor: 'rgba(153, 102, 255, 0.8)'
          }]
        },
        options: {
          cornerRadius: 5,
          responsive: true,
          maintainAspectRatio: true,
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 20,
              bottom: 0
            }
          },
          scales: {
            yAxes: [{
              display: true,
              stacked: true,
              gridLines: {
                display: true,
                drawBorder: false,
                color: "#F2F2F2"
              },
              scaleLabel: {
                display: true,
                labelString: 'kg co2 per part'
              },
              ticks: {
                display: true,
                min: 0,
                max: (supplier_total_avgs.length > 0) ? Math.ceil(Math.max.apply(Math, supplier_total_avgs) + 1) : 5,
                callback: function(value, index, values) {
                  return parseFloat(value).toFixed(2);
                },
                autoSkip: true,
                maxTicksLimit: 10,
                fontColor:"#6C7383"
              }
            }],
            xAxes: [{
              stacked: true,
              ticks: {
                beginAtZero: true,
                fontColor: "#6C7383"
              },
              scaleLabel: {
                display: true,
                labelString: 'Supplier Name'
              },
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
                display: false
              },
              barPercentage: 1
            }]
          },
          legend: {
            display: false
          },
          elements: {
            point: {
              radius: 0
            }
          }
        },
      });
      document.getElementById('supplier-average-legend').innerHTML = SupplierAverageChart.generateLegend();
    }

    if ($("#customer-part-average-chart").length) {
      var CustomerPartAverageChartCanvas = $("#customer-part-average-chart").get(0).getContext("2d");
      var CustomerPartAverageChart = new Chart(CustomerPartAverageChartCanvas, {
        type: 'bar',
        data: {
          labels: part_numbers,
          datasets: [{
            label: 'Average of Scope1',
            data: part_scope1_avgs,
            backgroundColor: 'rgba(255, 99, 132, 0.8)'
          }, {
            label: 'Average of Scope2',
            data: part_scope2_avgs,
            backgroundColor: 'rgba(54, 162, 235, 0.8)'
          }, {
            label: 'Average of Scope3',
            data: part_scope3_avgs,
            backgroundColor: 'rgba(255, 206, 86, 0.8)'
          }, {
            label: 'Average of Transportation',
            data: part_transport_avgs,
            backgroundColor: 'rgba(153, 102, 255, 0.8)'
          }]
        },
        options: {
          cornerRadius: 5,
          responsive: true,
          maintainAspectRatio: true,
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 20,
              bottom: 0
            }
          },
          scales: {
            yAxes: [{
              display: true,
              stacked: true,
              gridLines: {
                display: true,
                drawBorder: false,
                color: "#F2F2F2"
              },
              scaleLabel: {
                display: true,
                labelString: 'kg co2 per part'
              },
              ticks: {
                display: true,
                min: 0,
                max: (part_total_avgs.length > 0) ? Math.ceil(Math.max.apply(Math, part_total_avgs) + 1) : 5,
                callback: function(value, index, values) {
                  return parseFloat(value).toFixed(2);
                },
                autoSkip: true,
                maxTicksLimit: 10,
                fontColor:"#6C7383"
              }
            }],
            xAxes: [{
              stacked: true,
              ticks: {
                beginAtZero: true,
                fontColor: "#6C7383"
              },
              scaleLabel: {
                display: true,
                labelString: 'Part No.'
              },
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
                display: false
              },
              barPercentage: 1
            }]
          },
          legend: {
            display: false
          },
          elements: {
            point: {
              radius: 0
            }
          }
        },
      });
      document.getElementById('customer-part-average-legend').innerHTML = CustomerPartAverageChart.generateLegend();
    }
  }
  // Customer Charts/Graphs end
});