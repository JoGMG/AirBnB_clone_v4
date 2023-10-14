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

  // Stores/deletes states or cities data reviews
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

  // Stores/deletes cities data reviews
  $(".locations ul ul li input[type='checkbox']").change(function () {
    if (this.checked) {
      citiesDict[this.dataset.name] = this.dataset.id;
    } else {
      delete citiesDict[this.dataset.name];
    }
    updateLocations(statesDict, citiesDict);
  });

  // Get status of API
  $.getJSON("http://0.0.0.0:5001/api/v1/status/", function(data) {
    if (data.status === "OK") {
      $("div#api_status").addClass("available").css("background-color", "#ff545f");
    } else {
      $("div#api_status").removeClass("available");
    }
  });

  // Function to send post request to API to get places
  function placeRequest(filters) {
    $("div.boxes").empty();

    $.ajax({
      url: "http://0.0.0.0:5001/api/v1/places_search/",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(filters),
      success: function(response) {
        response.forEach(function(place) {
          $("div.boxes").append(
            `<article>
              <div class="place_header">
                <h2>${place.name}</h2>
                <div class="price_by_night">$${place.price_by_night}</div>
              </div>
              <div class="information">
                <div class="max_guest">${place.max_guest} Guest${place.max_guest > 1 ? "s" : ""}</div>
                <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms > 1 ? "s" : ""}</div>
                <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms > 1 ? "s" : ""}</div>
              </div>
              <div class="description">${place.description}</div>
              <div class="reviews" place-id="${place.id}">
                <div class="review_header">
                  <h2></h2>
                  <span>show</span>
                </div>
                <ul>
                </ul>
              </div>
            </article>`
          )
          reviewRequest(place.id)
        });
      }
    });
  }

  // Function to fetch and display reviews
  function reviewRequest(placeId) {
    const url = `http://0.0.0.0:5001/api/v1/places/${placeId}/reviews`;

    $.getJSON(url, function(reviews) {
      $(`.reviews[place-id="${placeId}"] h2`).text(reviews.length + " " + (reviews.length > 1 ? "Reviews" : "Review"))
      $(`.reviews[place-id="${placeId}"] span`).click(function() {
        const $reviewContainer = $(this).closest('.reviews[place-id]');
        const $reviewList = $reviewContainer.find('ul');
        const $reviewHeader = $reviewContainer.find('.review_header');
        if ($(this).text() === 'show') {
          reviews.forEach(function(review) {
            $.getJSON(`http://0.0.0.0:5001/api/v1/users/${review.user_id}`, function (user) {

              date = new Date(review.created_at);
              date = date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
              $reviewList.append(
                `<li>
                  <p><h3>From ${user.first_name + " " + user.last_name} on ${date}</h3>${review.text}</p>
                </li>`
              )
            });
          });
          $(this).text('hide');
          $reviewHeader.css('border-bottom', '2px solid #DDDDDD');
        } else {
          $(this).text('show');
          $reviewList.empty();
          $reviewHeader.css('border-bottom', '');
        }
      })
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
