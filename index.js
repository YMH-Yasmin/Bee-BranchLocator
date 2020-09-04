
/*** Geolocation (start) - https://developers.google.com/maps/documentation/javascript/examples/map-geolocation#maps_map_geolocation-javascript ***/

var map, infoWindow;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 15,
  });
  infoWindow = new google.maps.InfoWindow();

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        infoWindow.setPosition(pos);
        infoWindow.setContent('Location found.');
        // infoWindow.open(map);
        map.setCenter(pos);

        branches.forEach(function (branch) {
          markStore(branch, map);
        });
      },
      function () {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? 'Error: The Geolocation service failed.'
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

/*** Geolocation (end) ***/

/*** Simple Store Locator (start) https://simplestepscode.com/store-locator-api-tutorial/#step4 ***/
function markStore(branchInfo, map) {
  // Create a marker and set its position.
  var marker = new google.maps.Marker({
    position: branchInfo.location,
    map: map,
    title: branchInfo.name,
  });

  // show store info when marker is clicked
  marker.addListener('click', function () {
    showStoreInfo(branchInfo);
  });
}


/*** Simple Store Locator (end) ***/



// UI Interactions *****************

$(window).click(function( event ) {

  if ( $(".dropdown-items-ul").hasClass("show-dropdown") ) {
    $(".dropdown-items-ul").toggleClass("show-dropdown");

  } else if ( $(event.target).parent().is( ".dropdown-div" )){
    $(".dropdown-items-ul").toggleClass("show-dropdown");

  }
});

