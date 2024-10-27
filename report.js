class resultDataTable {

  applyFilters(supplier_name, start_date, end_date, reportTable) {
    $.ajax({
      type:'get',
      url:'/customer/get_results',
      data: { authenticity_token: $('[name="csrf-token"]')[0].content, supplier_name: supplier_name,
      start_date: start_date,
      end_date: end_date },
      success: function(result) {
        if (result) {
          reportTable.clear().draw();
          reportTable.rows.add(result.data);
          reportTable.columns.adjust().draw();
        }
      },
      failure: function(e) {
        console.log(e);
      }
    });
  }

  exportReport() {
    var supplier_name = $("#resultSupplierName").val();
    var start_date = $("#resultStartDate").val();
    var end_date = $("#resultEndDate").val();
    toastr.success("Results sheet downloaded successfully");
    window.location = "/customer/download_results?supplier_name=" + supplier_name + "&start_date=" + start_date + "&end_date=" + end_date;
  }

  supplierExportReport(checkedValues = null) {
    toastr.success("Results sheet downloaded successfully");
    if(checkedValues == null){
      window.location = "/download_results"
    }else{
      var csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      var arrayValues = checkedValues;
      var postData = {
          arrayValues: arrayValues,
          authenticity_token: $('[name="csrf-token"]')[0].content
      };
      fetch('/download_checked_results', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
      })
      .then(response => {
        const contentDispositionHeader = response.headers.get('Content-Disposition');
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDispositionHeader);
        let filename = 'downloaded_file.csv';
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
        return response.blob().then(blob => ({ blob, filename }));
      })
      .then(({ blob, filename }) => {

        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
       
        a.href = url;
        
        a.download = filename;
        
        document.body.appendChild(a);
        
        a.click();
  
        document.body.removeChild(a);
      })
      .catch(error => {
          console.error('Error:', error);
      });
    }
  }
}
$(function() {
  $('.chartview').on('click', function() {
    var footprintPieChartCanvas = $("#carbonfootprintPieChart").get(0);

    var ctx = footprintPieChartCanvas.getContext("2d");
    ctx.clearRect(0, 0, footprintPieChartCanvas.width, footprintPieChartCanvas.height);
    var id = $(this).attr('id').match(/\d+/)[0];
    var scope1 = parseFloat($('#scope1_result' + id).text());
    var scope2 = parseFloat($('#scope2_result' + id).text());
    var scope3 = parseFloat($('#scope3_result' + id).text());
    var transport = parseFloat($('#transport_result' + id).text());
    var total = parseFloat($('#total' + id).text());



    if (scope1 > 0 || scope2 > 0 || scope3 > 0 || transport > 0) {
      $('#carbonfootprintPieChart').css('filter', 'none');
      $('.no-data').hide();
    } else {
      scope1 = 20;
      scope2 = 10;
      scope3 = 25;
      transport = 12;
      $('#carbonfootprintPieChart').css('filter', 'blur(4px)');
      $('.no-data').show();
    }
    
    var footprintPieData = {
      datasets: [{
        data : [scope1, scope2, scope3, transport],
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
  
      // Labels for the legend and tooltips
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

            if (isNaN(percentage)) {
              percentage = 0;
          }
            
            return currentValue + ' (' + percentage + '%)';
          },
          title: function(tooltipItem, data) {
            return data.labels[tooltipItem[0].index];
          }
        }
      }
    };

    
    var pieChart = new Chart(ctx, {
      type: 'pie',
      data: footprintPieData,
      options: footprintPieOptions
    });

    $('#myModal').modal('show');
  });

  $('.data-dismiss').on('click', function() {
    $('#myModal').modal('hide');
  });
});

$(function() {
  var supplier_name = "";
  var start_date = "";
  var end_date = "";
  var result_data = new resultDataTable();

  // var result_table = loadDatatable(supplier_name, start_date, end_date);

  // function loadDatatable(supplier_name, start_date, end_date) {
  //   var table = $('#report_data').DataTable({
  //     pagingType: 'full_numbers',
  //     lengthChange: false,
  //     scrollX: true,
  //     retrieve: true,
  //     ajax: {
  //       url: '/customer/get_results',
  //       type: 'GET',
  //       data: {
  //         supplier_name: supplier_name,
  //         start_date: start_date,
  //         end_date: end_date
  //       }
  //     },
  //     columns: [
  //       { "data": "created_at"},
  //       { "data": "general_info.supplier_name" },
  //       { "data": "part_number" },
  //       { "data": "scope1_result" },
  //       { "data": "scope2_result" },
  //       { "data": "scope3_result" },
  //       { "data": "transport_result" },
  //       { "data": "total" },
  //       { "data": "status" },
  //       { "data": "id" }
  //     ],
  //     "columnDefs": [
  //       {
  //         data: null,
  //         defaultContent: '',
  //         targets: 7
  //       },
  //       {
  //         "render": function ( data, type, row ) {
  //           var date = new Date(data);
  //           return  date.getDate() + "-" + date.getMonth() + "-"+ date.getFullYear();
  //         },
  //         "targets": 0
  //       },
  //       {
  //         "render": function ( data, type, row ) {
  //           if (data == "in_progress") {
  //             return "<div class='badge badge-danger'>In-Progress</div>";
  //           } else if (data == "completed") {
  //             return "<div class='badge badge-success'>Completed</div>";
  //           }
  //         },
  //         "targets": 7
  //       },
  //       {
  //         "render": function ( data, type, row ) {
  //           if (row.status == "in_progress") {
  //             return "<a class='pl-2' data-toggle='tooltip' data-placement='auto' data-turbo='false' href='/customer/view_result/"+ data +"/general_info' data-bs-original-title='Edit Result' aria-label='Edit Result'><i class='ti-pencil-alt' style='font-size: 18px; color: #00a59e;'></i></a>";
  //           } else if (row.status == "completed") {
  //             return "<a class='pl-2' data-toggle='tooltip' data-placement='auto' data-turbo='false' href='/customer/view_result/"+ data +"/general_info' data-bs-original-title='View Result' aria-label='View Result'><i class='icon-paper' style='font-size: 18px; color: #00a59e;'></i></a>";
  //           }
  //         },
  //         "targets": 8
  //       },
  //       { targets: [7], className: 'text-center' },
  //       { targets: [8], className: 'text-center' },
  //       { "orderable": false, "targets": [7, 8] },
  //       { "searchable": true, "targets": [7, 8] },
  //     ],
  //     order: [[0, 'desc']],
  //     drawCallback: function () {
  //       let tooltipTriggerList = document.querySelectorAll('[data-toggle="tooltip"]');
  //       let tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl, {
  //         boundary: document.body,
  //         container: 'body',
  //         trigger: 'hover'
  //       }));
  //       tooltipList.forEach((tooltip) => { $('.tooltip').hide(); });
  //     }
  //   });
  //   return table;
  // }

  // $('.input-daterange').datepicker({
  //   format: "dd/mm/yyyy"
  // });

  // $('#applyFilters').on('click', function() {
  //   supplier_name = $("#resultSupplierName").val();
  //   start_date = $("#resultStartDate").val();
  //   end_date = $("#resultEndDate").val();

  //   if ((supplier_name == "") && (start_date == "") && (end_date == "")) {
  //     toastr.error("Please select any filter.");
  //   } else {
  //     var resultTable = result_table;
  //     result_data.applyFilters(supplier_name, start_date, end_date, resultTable)
  //   }
  // })

  $('#exportData').on('click', function() {
    result_data.exportReport();
  });

  $('#supplierExportData').on('click', function() {
    var checkedCheckboxes = $('.download_data:checked');
    var valuesArray = null;
    if (checkedCheckboxes.length > 0) {
        valuesArray = checkedCheckboxes.map(function() {
        return $(this).val();
      }).get();
    } 
  
    result_data.supplierExportReport(valuesArray);
  });

  $('#report_data').DataTable({
    pagingType: 'full_numbers',
    order: [[0, 'desc']],
    lengthChange: false,
    "aoColumnDefs": [
        { "bSortable": false, "aTargets": [ 8, 9 ] },
        { "bSearchable": false, "aTargets": [ 8, 9 ] }
    ]
  });

})