$(document).ready(function () {
  // Implements changes in input tag with type checkbox
  const amenitiesDict = {};
  $("input[type='checkbox']").change(function () {
    if (this.checked) {
      amenitiesDict[this.dataset.name] = this.dataset.id;
    } else {
      delete amenitiesDict[this.dataset.name];
    }
    $("div.amenities h4").text(Object.keys(amenitiesDict).join(", "));
  });

  // get status of API
  $.getJSON("http://0.0.0.0:5001/api/v1/status/", function(data) {
    if (data.status === "OK") {
      $("div#api_status").addClass("available");
    } else {
      $("div#api_status").removeClass("available");
    }
  });
});
