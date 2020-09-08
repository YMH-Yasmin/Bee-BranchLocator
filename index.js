/* Rsoureces
    - Overview: https://developers.google.com/maps/documentation/javascript/overview#maps_map_simple-javascript
    - Geolocation: https://developers.google.com/maps/documentation/javascript/examples/map-geolocation#maps_map_geolocation-javascript
    - Simple Store Locator: https://simplestepscode.com/store-locator-api-tutorial/#step4
    - Places Library: https://developers.google.com/maps/documentation/javascript/places
    - Get my current address using javascript: https://stackoverflow.com/questions/14580715/get-my-current-address-using-javascript
    - Reverse Geocoding: https://developers.google.com/maps/documentation/javascript/examples/geocoding-reverse
    - 
*/

$(window).click(function (event) {
  // anywhere on screen is clicked (except dropdown itself).
  if (
    !$(event.target).is('.selected-value') &&
    $('.dropdown-items-ul').css('display') == 'block'
  ) {
    // hide dropdown if anywhere on screen is clicked (except dropdown itself).
    $('.dropdown-items-ul').slideToggle('show-dropdown');
  }

  // if one of dropdown items is clicked, set is as the selected item.
  if ($(event.target).parent().is('.dropdown-items-ul')) {
    $('.selected-value').text(event.target.id);
  }
});

function toggleDropdown() {
  // show/hide dropdown when dropdown-div is clicked (called in HTML).
  $('.dropdown-items-ul').slideToggle('show-dropdown');
}

// Handling Map Interactions ***************************************

var map, infoWindow;

function initMap() {
  // zoom levels: 1 (World), 5 (Landmass/continent), 10 (City), 15 (Streets), 20 (Buildings).

  var egypt = new google.maps.LatLng(26.8206, 30.8025);
  infoWindow = new google.maps.InfoWindow();

  // initializing a map with given coordinates.
  map = new google.maps.Map(document.getElementById('map'), {
    center: egypt,
    zoom: 6,
  });

  markBranches();
}

function getCurrentLocation() {
  // called once location-btn is clicked (sets Map to current location).

  if (navigator.geolocation) {
    // Browser supports geolocatin (get current location).
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        infoWindow.setPosition(pos);
        infoWindow.setContent('You are here.');
        infoWindow.open(map);
        map.setZoom(15);
        map.setCenter(pos);

        getCurrentAddress(map, infoWindow, pos);
      },
      function () {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation.
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? // ? 'Error: The Geolocation service failed.'
        'Error: Unable to get your current location.'
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

function getCurrentAddress(map, infowindow, pos) {
  // get current Address from coordinates (pos) using Geocoder API.

  var geocoder = new google.maps.Geocoder();

  if (geocoder) {
    geocoder.geocode({ latLng: pos }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        console.log(results[0].formatted_address);

        // create marker at current position.
        const marker = new google.maps.Marker({
          position: pos,
          map: map,
        });

        // open an infoWindow above marker & set its content to current address.
        infowindow.setContent(results[0].formatted_address);
        infowindow.open(map, marker);
      } else {
        $('.location-input').css('font-size', '12px');
        $('.location-input').attr(
          'placeholder',
          "Couldn't get current addres due to Billing."
        );

        console.log('Geocoding failed: ' + status);
      }
    });
  }
}

// create MARKERS & add them to the Map ********************************
function markBranches() {
  branches.forEach(function (branch) {
    createAMarker(branch, map);
  });
}

function createAMarker(branchInfo, map) {
  // Create a marker and set its position.
  var marker = new google.maps.Marker({
    position: branchInfo.location,
    map: map,
    title: branchInfo.name,
  });

  // show store info when marker is clicked
  marker.addListener('click', function () {
    branchInfo;
  });
}

// to-do: implement this function!!!
function showStoreInfo(branchInfo) {}

// show Branch Details ********************************

function showBranches(branches) {
  let i = 1;
  for (branch of branches) {
    $('.branches-details-div').append(`
    <div class="branch-details-div">
      <a class="address-title">${branch.name}</a>
      <a class="opening-hours">${branch.hours}</a>
      <a class="address"><i class="fas fa-directions"></i>${branch.address}</a>
      <a class="phone"><i class="fa fas-phone-alt"></i>${branch.number}</a>
    </div>`);

    if (i < branches.length) {
      $('.branches-details-div').append('<hr>');
    }
    i++;
  }
}

function showAllBranches() {
  if ($('.branches-details-div').css('display') == 'none') {
    showBranches(branches);
    $('.branches-details-div').css('display', 'flex');
  }
}

// todo: calculate nearest branches using current location & branch locations!
function locateNearestBranch() {
  $('.branches-details-div').css('display', 'none');
  $('.branches-details-div').html('');

  // change to display nearest branches only!
  showBranches(branches);
}
