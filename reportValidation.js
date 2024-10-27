$(function() {
  $("form#reportForm").validate({
    rules: {
      'report[cin]': 'required',
      'report[name]': 'required',
      'report[year_of_incorporation]':  {
          required: true,
          digits: true
        },
      'report[financial_year]': 'required',
      'report[registered_office_address]': 'required',
      'report[corporate_address]': 'required',
      'report[email]': {
        required: true,
        email: true
      },
      'report[telephone]': {required: true,digits: true,minlength: 10},
      'report[website]': {
        required: true,
        url: true
      },
      'report[stock_exchange_name]': 'required',
      'report[paid_up_capital]':  {
          required: true,
          digits: true
        },
      'report[contact_person_name]': 'required',
      'report[contact_person_telephone]':   {
          required: true,
          minlength: 10,
          digits: true
        },
      'report[contact_person_email]': {
        required: true,
        email: true
      },
      'report[reporting_boundary]': 'required'
    },
    errorPlacement: function(error, element) {
      var errorId = element.attr('id') + '-error';
      $("#" + errorId).html(error);
    },
    submitHandler: function(form) {
      form.submit();
    }
  });

  $("#submitButton").on("click", function() {
    if ($("form#reportForm").valid()) {
      return true;
    } else {
      return false;
    }
  });
});
  