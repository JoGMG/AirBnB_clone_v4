$(document).ready(function () {

	// Implements changes in input tag with type checkbox
	const amenitiesDict = {};
	$(".amenities input[type='checkbox']").change(function () {
		if (this.checked) {
			amenitiesDict[this.dataset.name] = this.dataset.id;
		} else {
			delete amenitiesDict[this.dataset.name];
		}
		$("div.amenities h4").text(Object.keys(amenitiesDict).join(", "));
	});

	// Updates locations h4 tag with states or cities dataset name
  function updateLocations(statesDict, citiesDict) {
    const locations = Object.assign({}, statesDict, citiesDict);
    if (Object.values(locations).length === 0) {
      $('.locations h4').html('&nbsp;');
    } else {
      $('.locations h4').text(Object.keys(locations).join(', '));
    }

		// Check if no input checkboxes are checked
		if ($('input[type="checkbox"]:checked').length === 0) {
			$('.locations h4').html('&nbsp;');

			for (const key in statesDict) {
				delete statesDict[key];
			}
			for (const key in citiesDict) {
				delete citiesDict[key]
			}
		}
	}

	// Stores/deletes states or cities data items
  const statesDict = {};
	const citiesDict = {};
	$(".locations > ul > li > input[type='checkbox']").change(function () {
		if (this.checked) {
			statesDict[this.dataset.name] = this.dataset.id;
      $(this).siblings("ul").find("input[type='checkbox']").prop("checked", true);
			$(this).siblings("ul").find("input[type='checkbox']").each(function () {
				if ($(this).prop("checked")) {
					citiesDict[this.dataset.name] = this.dataset.id;
				}
			});
		} else {
			delete statesDict[this.dataset.name];
      $(this).siblings("ul").find("input[type='checkbox']").prop("checked", false);
			$(this).siblings("ul").find("input[type='checkbox']").each(function () {
				if (!$(this).prop("checked")) {
					delete citiesDict[this.dataset.name];
				}
			});
		}
		updateLocations(statesDict, citiesDict);
	});

	// Stores/deletes cities data items
	$(".locations ul ul li input[type='checkbox']").change(function () {
		if (this.checked) {
			citiesDict[this.dataset.name] = this.dataset.id;
		} else {
			delete citiesDict[this.dataset.name];
		}
    updateLocations(statesDict, citiesDict);
	});

  // Get status of API
  $.getJSON("http://192.168.8.103:5001/api/v1/status/", function(data) {
    if (data.status === "OK") {
      $("div#api_status").addClass("available");
    } else {
      $("div#api_status").removeClass("available");
    }
  });

  // Function to send post request to API
  function placeRequest(filters) {
    $("section.places").empty();

    $.ajax({
      url: "http://192.168.8.103:5001/api/v1/places_search/",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(filters),
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
  }

  // Send new post request when search is clicked
  $("button").click(function() {
    const filters = {
      amenities: Object.values(amenitiesDict),
      states: Object.values(statesDict),
      cities: Object.values(citiesDict)
    };
    placeRequest(filters);
  });

  placeRequest({});
});
