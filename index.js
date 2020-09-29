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
   infoWindowUserLocation: infoWindo to pop up on user's location in map.
   currentLocation: current location coordinates;
*/
var map,
  infoWindowUserLocation,
  currentLocation,
  nearestOutlets = [],
  outlets;

// Initiate Google Map (showing Egypt) ************************************
// Zoom Levels: 1 (World), 5 (Landmass/continent), 10 (City), 15 (Streets), 20 (Buildings).

// FUNCTIONALITY 1 - INITIATE MAP. *********************************

function initMap() {
  const egypt = new google.maps.LatLng(26.8206, 30.8025);
  infoWindowUserLocation = new google.maps.InfoWindow();

  map = new google.maps.Map(document.getElementById('map'), {
    center: egypt,
    zoom: 6,
  });
}

// END OF FUNCTIONALITY 1 *******************************************************************

// FUNCTIONALITY ... - Fetch JSON DATA. *********************************

fetch('./outlets.json')
  .then(function (resp) {
    return resp.json();
  })
  .then(function (data) {
    outlets = data;
  });

// END OF FUNCTIONALITY ... *******************************************************************

// FUNCTIONALITY 2 - GET CURRENT LOCATION. *********************************

function locateNearestBranch() {
  if (currentLocation == null) {
    // if we don't have user's location --> get it.
    getCurrentLocation();
    return;
  }

  infoWindowUserLocation.open(map);

  setOutletDistanceJSON(currentLocation, outlets);

  getNearestBranches(outlets);

  addOutletMarkers(nearestOutlets);

  showOutletCards(nearestOutlets);
}

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

        infoWindowUserLocation.setPosition(currentLocation);
        infoWindowUserLocation.setContent('You are here.');
        infoWindowUserLocation.open(map);
        map.setZoom(15);
        map.setCenter(currentLocation);

        setOutletDistanceJSON(currentLocation, outlets);

        getNearestBranches(outlets);

        addOutletMarkers(nearestOutlets);

        showOutletCards(nearestOutlets);
      },
      function () {
        handleLocationError(true, infoWindowUserLocation, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation.
    handleLocationError(false, infoWindowUserLocation, map.getCenter());
  }
}

function handleLocationError(
  browserHasGeolocation,
  infoWindowUserLocation,
  currentLocation
) {
  infoWindowUserLocation.setPosition(currentLocation);
  infoWindowUserLocation.setContent(
    browserHasGeolocation
      ? // ? 'Error: The Geolocation service failed.'
        'Error: Unable to get your current location.'
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindowUserLocation.open(map);
}
// END OF FUNCTIONALITY 2 *******************************************************************

function setOutletDistanceJSON(currentLoc, outletsJSON) {

  for (outlet of outletsJSON) {
    outlet.distance = haversine_distanceJSON(currentLoc, outlet.latitude, outlet.longitude);
  }
}

function haversine_distanceJSON(mk1, mk2Lat, mk2lng) {
  // Calculate Distance (in km) between two coordinates.

  var R = 6371.071; // Radius of the Earth in kilometers
  var rlat1 = mk1.lat * (Math.PI / 180); // Convert degrees to radians
  var rlat2 = mk2Lat * (Math.PI / 180); // Convert degrees to radians
  var difflat = rlat2 - rlat1; // Radian difference (latitudes)
  var difflon = (mk2lng - mk1.lng) * (Math.PI / 180); // Radian difference (longitudes)
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
// END OF FUNCTIONALITY 3&4 ****************************************************************

// FUNCTIONALITY 5&6 - GET NEAREST 5 OUTLETS & ADD THEIR LOCATION MARKERS IN MAP. **********

function getNearestBranches(outletsParam) {
  // .slice(0) to pass array by value, leaving branches unaltered.
  let tempOutlets = outletsParam.slice(0);

  let d = tempOutlets[0].distance;
  let closestOutlet;

  nearestOutlets = [];

  for (let i = 0; i < 5; i++) {
    for (outlet of tempOutlets) {
      if (outlet.distance <= d) {
        closestOutlet = outlet;
      }
    }
    tempOutlets.splice(tempOutlets.indexOf(closestOutlet), 1);
    nearestOutlets.push(closestOutlet);
    d = tempOutlets[0].distance;
  }
}

function addOutletMarkers(outletsParam) {
  outletsParam.forEach(function (outletParam) {
    createAMarker(outletParam);
  });
}

function createAMarker(outletParam) {
  // Create a marker and set its position.
  var marker = new google.maps.Marker({
    map: map,
    position: {lat: outletParam.latitude, lng: outletParam.longitude},
    clickable: true,
    title: outletParam.name,
  });

  var infoWindowTextForMarker = `<div class="infoWindow-div">
       <h3>${outletParam.name}</h3>
       <a>${Math.round(outletParam.distance * 10) / 10} km away from you</a>
       <a href="${
<<<<<<< HEAD
        outletParam.directionsurl
       }"><i class="fa fa-directions"></i>Directions</a>
=======
         outlet.directions
       }"><i class="fa fa-directions"></i>${outlet.address}</a>
>>>>>>> a4d3f1a028c6346067247fe99d0f2747733e8a2a
       <a href="tel:${
        outletParam.phonenumber
       }" class="phone"><i class="fa fa-phone-alt"></i>${outletParam.phonenumber}</a>
       </div>`;

  marker.info = new google.maps.InfoWindow({
    content: infoWindowTextForMarker,
  });

  // show store info when marker is clicked.
  marker.addListener('click', function () {
    marker.info.open(map, marker);
  });
}

// END OF FUNCTIONALITY 5&6 ****************************************************************

// FUNCTIONALITY 7 - DISPLAY NEAREST OUTLETS CARDS . ***************************************

function showOutletCards(outletsToShow) {
  clearOutletCardsDiv();
  let i = 1;

  for (outlet of outletsToShow) {
    showOutletDetail(outlet);
    if (i < outlet.length) {
      $('.branches-details-div').append('<hr>');
    }
    i++;
  }
}

function clearOutletCardsDiv() {
  $('.branches-details-div').html('');
}

function showOutletDetail(outletParam) {
  if (outletParam.distance != '') {
    $('.branches-details-div').append(`
    <div class="branch-details-div">
      <a class="branch-title">${outletParam.name}</a>
      <a class="distance">${
        Math.round(outletParam.distance * 10) / 10
      } km away from you</a>
      <a href="${
        outletParam.directionsurl
      }" class="address"><i class="fa fa-directions"></i>${outletParam.address}</a>
    <a href="tel:${
      outletParam.phonenumber
    }" class="phone"><i class="fa fa-phone-alt"></i>${outletParam.phonenumber}</a>
    </div>`);
  }
}

// END OF FUNCTIONALITY 7 ************************************************

// function showOutletDetail(outlet) {
//   if (outlet.distance != '') {
//     $('.branches-details-div').append(`
//     <div class="branch-details-div">
//       <a class="branch-title">${outlet.name}</a>
//       <a class="distance">${
//         Math.round(outlet.distance * 10) / 10
//       } km away from you</a>
//       <a href="${
//         outlet.directions
//       }" class="address"><i class="fa fa-directions"></i>${
//       outlet.address
//     }</a>`);

//     for (phoneNumber of outlet.number) {
//       $('.branches-details-div').append(
//         `<a href="tel:${phoneNumber}" class="phone"><i class="fa fa-phone-alt"></i>${phoneNumber}</a>`
//       );
//     }

//     $('.branches-details-div').append(`</div>`);
//     console.log($('.branches-details-div'));
//   }
// }
