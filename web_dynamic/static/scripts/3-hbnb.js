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

  // Get status of API
  $.getJSON("http://192.168.8.103:5001/api/v1/status/", function(data) {
    if (data.status === "OK") {
      $("div#api_status").addClass("available");
    } else {
      $("div#api_status").removeClass("available");
    }
  });

  // Send post request to API
  $.ajax({
    url: "http://192.168.8.103:5001/api/v1/places_search/",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({}),
    success: function(response) {
      response.forEach(function(place) {
        $("section.places").append(
          `<article>
          <div class="title_box">
            <h2>${place.name}</h2>
            <div class="price_by_night">${place.price_by_night}</div>
          </div>
          <div class="information">
            <div class="max_guest">${place.max_guest} Guest${place.max_guest > 1 ? "s" : ""}</div>
            <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms > 1 ? "s" : ""}</div>
            <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms > 1 ? "s" : ""}</div>
          </div>
          <div class="description">${place.description}</div>
          </article>`
        )
      });
    }
  });
});
