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
});
