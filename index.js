/* Rsoureces
    - Overview: https://developers.google.com/maps/documentation/javascript/overview#maps_map_simple-javascript
    - Geolocation: https://developers.google.com/maps/documentation/javascript/examples/map-geolocation#maps_map_geolocation-javascript
    - Simple Store Locator: https://simplestepscode.com/store-locator-api-tutorial/#step4
    - Places Library: https://developers.google.com/maps/documentation/javascript/places
    - Get my current address using javascript: https://stackoverflow.com/questions/14580715/get-my-current-address-using-javascript
    - Reverse Geocoding: https://developers.google.com/maps/documentation/javascript/examples/geocoding-reverse
    - Calculate distances on a map with the Maps JavaScript API : https://cloud.google.com/blog/products/maps-platform/how-calculate-distances-map-maps-javascript-api
    
*/

/* map: for initiating a google map.
   infoWindow: display location popup in map.
   currentLocation: current location coordinates;
   service: 
*/
var map,
  infoWindow,
  currentLocation,
  nearestBranches = [],
  service;

// Initiate Google Map (showing Egypt) ************************************
// Zoom Levels: 1 (World), 5 (Landmass/continent), 10 (City), 15 (Streets), 20 (Buildings).

function initMap() {
  const egypt = new google.maps.LatLng(26.8206, 30.8025);
  infoWindow = new google.maps.InfoWindow();

  map = new google.maps.Map(document.getElementById('map'), {
    center: egypt,
    zoom: 6,
  });
}

function locateNearestBranch() {
  if (currentLocation == null) {
    // if we don't have user's location --> get it.
    getCurrentLocation();
    return;
  }

  // Update Distances in Outlet Info.
  setOutletDistance(currentLocation, branches);

  getNearestBranches(branches);

  addOutletMarkers(nearestBranches);

  // let nearestBranch = getNearestBranch(branches);

  // clearBranchesDetailsDiv();
  // showBranchDetail(nearestBranch);

  // drawStraightLine(currentLocation, nearestBranch.coordinates);
}

// FUNCTIONALITY 2 - GET CURRENT LOCATION. *********************************
function getCurrentLocation() {
  // using Google Geolocation API to get current location.

  if (navigator.geolocation) {
    // if Browser supports geolocatin --> get current location.
    navigator.geolocation.getCurrentPosition(
      function (position) {
        currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        infoWindow.setPosition(currentLocation);
        infoWindow.setContent('You are here.');
        infoWindow.open(map);
        map.setZoom(15);
        map.setCenter(currentLocation);
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
// END OF FUNCTIONALITY 2 ************************************************

// FUNCATIONALITY 3&4 - UPDATE OUTLET DISTANCES ****************************
function setOutletDistance(currentLoc, branchesJSON) {
  for (branch of branchesJSON) {
    branch.distance = haversine_distance(currentLoc, branch.coordinates);
  }
}

function haversine_distance(mk1, mk2) {
  // Calculate Distance (in km) between two coordinates.

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
// END OF FUNCTIONALITY 3&4 ************************************************

// FUNCTIONALITY 5 - GET NEAREST 5 OUTLETS & ADD THEIR LOCATION MARKERS IN MAP. ******

function getNearestBranches(branches) {
  // .slice(0) to pass array by value, leaving branches unaltered.
  let tempBranches = branches.slice(0);

  let d = tempBranches[0].distance;
  let closestBranch;

  nearestBranches = [];

  for (let i = 0; i < 5; i++) {
    for (branch of tempBranches) {
      if (branch.distance <= d) {
        closestBranch = branch;
      }
    }
    tempBranches.splice(tempBranches.indexOf(closestBranch), 1);
    nearestBranches.push(closestBranch);
    d = tempBranches[0].distance;
  }
  console.log(nearestBranches);
}

function addOutletMarkers(nearestBranchesToMark) {
  nearestBranchesToMark.forEach(function (branch) {
    createAMarker(branch);
  });
}

function createAMarker(branchInfo) {
  // Create a marker and set its position.
  var marker = new google.maps.Marker({
    position: branchInfo.coordinates,
    map: map,
    title: branchInfo.name,
  });

  // show store info when marker is clicked
  marker.addListener('click', function () {
    branchInfo;
    // infowindow.setContent(results[0].formatted_address);
    // infowindow.open(map, marker);
  });
}

// END OF FUNCTIONALITY 5 ************************************************


// to-do: implement this function!!!
function showStoreInfo(branchInfo) {}

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
  if (branch.distance != '') {
    $('.branches-details-div').append(`
    <div class="branch-details-div">
      <a class="branch-title">${branch.name}</a>
      <a class="opening-hours">${branch.hours}</a>
      <a class="distance">${
        Math.round(branch.distance * 10) / 10
      } km away from you</a>
      <a class="address"><i class="fa fa-directions"></i> ${branch.address}</a>
      <a class="phone"><i class="fa fa-phone-alt"></i> ${branch.number}</a>
    </div>`);
  } else {
    $('.branches-details-div').append(`
    <div class="branch-details-div">
      <a class="branch-title">${branch.name}</a>
      <a class="opening-hours">${branch.hours}</a>
      <a class="address"><i class="fa fa-directions"></i> ${branch.address}</a>
      <a class="phone"><i class="fa fa-phone-alt"></i> ${branch.number}</a>
    </div>`);
  }
}

// Draw a straight line between currentLocation & destination -----------------------------------

function drawStraightLine(currentLocation, destination) {
  var line = new google.maps.Polyline({
    path: [currentLocation, destination],
    map: map,
  });
}