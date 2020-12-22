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
function initMap() {
  const egypt = new google.maps.LatLng(26.8206, 30.8025);
  infoWindowUserLocation = new google.maps.InfoWindow();

  map = new google.maps.Map(document.getElementById('map'), {
    center: egypt,
    zoom: 6,
  });
}

function fetchNearestOutletsFromServer(currentLocation) {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:5000/getNearestOutlets',
    // contentType: 'application/json',
    crossDomain: true,
    data: currentLocation,
    dataType: 'json',
    // processData: false,
    success: function (data) {
      nearestOutlets = data;
      addOutletMarkers(nearestOutlets);
      showOutletCards(nearestOutlets);
    },
    error: function () {
      console.log('Could not read Outlets data!');
    },
  });
}

// using Google Geolocation API to get current location.
function getCurrentLocation() {
  if (navigator.geolocation) {
    // if Browser supports geolocatin --> get current location.
    navigator.geolocation.getCurrentPosition(
      function (position) {
        currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log(currentLocation);

        infoWindowUserLocation.setPosition(currentLocation);
        infoWindowUserLocation.setContent('You are here.');
        infoWindowUserLocation.open(map);
        map.setZoom(15);
        map.setCenter(currentLocation);

        fetchNearestOutletsFromServer(currentLocation);
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

function addOutletMarkers(outletsParam) {
  outletsParam.forEach(function (outletParam) {
    createAMarker(outletParam);
  });
}

function createAMarker(outletParam) {
  // Create a marker and set its position.
  var marker = new google.maps.Marker({
    map: map,
    position: {
      lat: parseFloat(outletParam.Latitude),
      lng: parseFloat(outletParam.Longitude),
    },
    clickable: true,
    title: outletParam.Name,
  });

  var infoWindowTextForMarker = `<div class="infoWindow-div">
       <h3>${outletParam.Name}</h3>
       <a>${Math.round(outletParam.distance * 10) / 10} km away from you</a>
       <a href="${
         outletParam['Directions URL']
       }"><i class="fa fa-directions"></i>${outletParam.Address}</a>`;

  let phoneNumbersArray = outletParam['Phone Number'].split(',');
  for (phoneNumber of phoneNumbersArray) {
    infoWindowTextForMarker += `<a href="tel:${phoneNumber}" class="phone"><i class="fa fa-phone-alt"></i>${phoneNumber}</a>`;
  }

  infoWindowTextForMarker += `</div>`;

  marker.info = new google.maps.InfoWindow({
    content: infoWindowTextForMarker,
  });

  // show store info when marker is clicked.
  marker.addListener('click', function () {
    marker.info.open(map, marker);
  });
}

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
  let name = outletParam.Name.replace(/\s/g, '');

  if (outletParam.distance != '') {
    $('.branches-details-div').append(`
    <div class="branch-details-div ${name}">
      <a class="branch-title">${outletParam.Name}</a>
      <a class="distance">${
        Math.round(outletParam.distance * 10) / 10
      } km away from you</a>
      <a href="${
        outletParam['Directions URL']
      }" class="address"><i class="fa fa-directions"></i>${
      outletParam.Address
    }</a>
    </div>`);

    let phoneNumbersArray = outletParam['Phone Number'].split(',');
    for (phoneNumber of phoneNumbersArray) {
      $(`.${name}`).append(
        `<a href="tel:${phoneNumber}" class="phone"><i class="fa fa-phone-alt"></i>${phoneNumber}</a>`
      );
    }
  }
}
