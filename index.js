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

/* map: for initiating a google map.
   infoWindow: display location popup in map.
   currentLocation: current location coordinates;
   service: 
   pyrmont:
*/
var map, infoWindow, service, currentLocation, pyrmont;

// Initiate Google Map --------------------------------------------------

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

// Google Geolocation API -------------------------------------------------

function getCurrentLocation() {
  // called once location-btn is clicked (sets Map to current location).

  if (navigator.geolocation) {
    // Browser supports geolocatin (get current location).
    navigator.geolocation.getCurrentPosition(
      function (position) {
        currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        pyrmont = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );

        infoWindow.setPosition(currentLocation);
        infoWindow.setContent('You are here.');
        infoWindow.open(map);
        map.setZoom(15);
        map.setCenter(currentLocation);

        getCurrentAddress(map, infoWindow, currentLocation);
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

function handleLocationError(
  browserHasGeolocation,
  infoWindow,
  currentLocation
) {
  infoWindow.setPosition(currentLocation);
  infoWindow.setContent(
    browserHasGeolocation
      ? // ? 'Error: The Geolocation service failed.'
        'Error: Unable to get your current location.'
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

// Google Geocoder API (NOT WORKING due to Billing) -------------------------------------------------

function getCurrentAddress(map, infowindow) {
  // get current Address from coordinates (currentLocation).

  var geocoder = new google.maps.Geocoder();

  if (geocoder) {
    geocoder.geocode({ latLng: currentLocation }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        console.log(results[0].formatted_address);

        // create marker at current location.
        const marker = new google.maps.Marker({
          position: currentLocation,
          map: map,
        });

        // open an infoWindow above marker & set its content to current address.
        infowindow.setContent(results[0].formatted_address);
        infowindow.open(map, marker);
      } else {
        $('.location-input').css('font-size', '11px');
        $('.location-input').attr(
          'placeholder',
          'Your current address is displayed on the map.'
        );

        console.log('Geocoding failed: ' + status);
      }
    });
  }
}

// Create MARKERS & add them to the Map --------------------------------------

function markBranches() {
  branches.forEach(function (branch) {
    createAMarker(branch, map);
  });
}

function createAMarker(branchInfo, map) {
  // Create a marker and set its position.
  var marker = new google.maps.Marker({
    position: branchInfo.coordinates,
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

// Locate Nearest Branch ------------------------------------------------------

function locateNearestBranch() {
  if (currentLocation == null) {
    // get current location, if we don't have it.
    getCurrentLocation();
    return;
  }

  // set distances between current lcoation & branches.
  setBranchesDistance(currentLocation, branches);

  let nearestBranch = getNearestBranch(branches);

  clearBranchesDetailsDiv();
  showBranchDetail(nearestBranch);

  drawStraightLine(currentLocation, nearestBranch.coordinates);

  // var pyrmont = new google.maps.LatLng(
  //   currentLocation.lat,
  //   currentLocation.lan
  // );
  // var request = {
  //   location: pyrmont,
  //   radius: '5000',
  //   type: ['restaurant'],
  // };
  // service = new google.maps.places.PlacesService(map);
  // service.nearbySearch(request, callback);
}

// function callback(results, status) {
//   if (status == google.maps.places.PlacesServiceStatus.OK) {
//     for (var i = 0; i < results.length; i++) {
//       createMarker(results[i]);
//     }
//   }
// }

// Get Nearest Branch -------------------------------------------------------------
function getNearestBranch(branches) {
  let nearestBranch;
  let i = branches[0].distance;

  for (branch of branches) {
    if (branch.distance <= i) {
      nearestBranch = branch;
    }
  }
  return nearestBranch;
}

// Clear Branches Details Div -----------------------------------------------------
function clearBranchesDetailsDiv() {
  $('.branches-details-div').html('');
}

// Show Branches Details Div ------------------------------------------------------

function showAllBranches() {
  clearBranchesDetailsDiv();

  let i = 1;

  for (branch of branches) {
    showBranchDetail(branch);
    if (i < branches.length) {
      $('.branches-details-div').append('<hr>');
    }
    i++;
  }
}

// Create Branch Details HTML ------------------------------------------------------

function showBranchDetail(branch) {
  $('.branches-details-div').append(`
    <div class="branch-details-div">
      <a class="branch-title">${branch.name}</a>
      <a class="opening-hours">${branch.hours}</a>
      <a class="address"><i class="fa fa-directions"></i> ${branch.address}</a>
      <a class="phone"><i class="fa fa-phone-alt"></i> ${branch.number}</a>
    </div>`);
}

// Google Place Autocomplete (NOT WORKING due to Billing) ------------------------------------------------------

function triggerPlacesAutoComplete() {
  const placeAutoCompleteInput = document.getElementById('location-input');
  const searchBox = new google.maps.places.SearchBox(placeAutoCompleteInput);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', () => {
    searchBox.setBounds(map.getBounds());
  });

  let markers = [];

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
    // Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];
    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
      if (!place.geometry) {
        console.log('Returned place contains no geometry');
        return;
      }
      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };
      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        })
      );

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}

// Get Distance (in km) between two coordinates -----------------------------------

function haversine_distance(mk1, mk2) {
  var R = 6371.071; // Radius of the Earth in kilometers
  var rlat1 = mk1.lat * (Math.PI / 180); // Convert degrees to radians
  var rlat2 = mk2.lat * (Math.PI / 180); // Convert degrees to radians
  var difflat = rlat2 - rlat1; // Radian difference (latitudes)
  var difflon = (mk2.lng - mk1.lng) * (Math.PI / 180); // Radian difference (longitudes)

  var d =
    2 *
    R *
    Math.asin(
      Math.sqrt(
        Math.sin(difflat / 2) * Math.sin(difflat / 2) +
          Math.cos(rlat1) *
            Math.cos(rlat2) *
            Math.sin(difflon / 2) *
            Math.sin(difflon / 2)
      )
    );
  return d;
}

function setBranchesDistance(currentLoc, branchesJSON) {
  for (branch of branchesJSON) {
    branch.distance = haversine_distance(currentLoc, branch.coordinates);
  }
}

// Draw a straight line between currentLocation & destination -----------------------------------

function drawStraightLine(currentLocation, destination) {
  var line = new google.maps.Polyline({
    path: [currentLocation, destination],
    map: map,
  });
}

// Google Directions API (NOT WORKING due to Billing) ------------------------------------------------------

function getDirections(currentLocation) {
  if (currentLocation != null) {
    let destination = { lat: 30.045612, lng: 31.204183 };

    let directionsService = new google.maps.DirectionsService();
    let directionsRenderer = new google.maps.DirectionsRenderer();

    directionsRenderer.setMap(map); // Existing map object displays directions

    // Create route from existing points used for markers
    const route = {
      origin: currentLocation,
      destination: destination,
      travelMode: 'DRIVING',
    };

    directionsService.route(route, function (response, status) {
      // anonymous function to capture directions
      if (status !== 'OK') {
        console.log('Directions request failed due to ' + status);

        drawStraightLine(currentLocation, destination);
        return;
      } else {
        directionsRenderer.setDirections(response); // Add route to the map
        var directionsData = response.routes[0].legs[0]; // Get data about the mapped route
        if (!directionsData) {
          console.log('Directions request failed');
          return;
        } else {
          console.log(
            ' Driving distance is ' +
              directionsData.distance.text +
              ' (' +
              directionsData.duration.text +
              ').'
          );
        }
      }
    });
  }
}
