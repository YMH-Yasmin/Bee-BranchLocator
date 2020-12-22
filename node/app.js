var outlets,
  currentLocation,
  nearestOutlets = [];

outlets = require('./outlets.json');

// ********** FUNCTIONALITY 3&4 - Get & Set Outlet distances.
function setOutletDistanceInJSON(currentLoc, outletsJSON) {
  for (outlet of outletsJSON) {
    outlet.distance = haversine_distance(
      currentLoc,
      parseFloat(outlet.Latitude),
      parseFloat(outlet.Longitude)
    );
  }
}

// Calculate Distance (in km) between two coordinates.
function haversine_distance(mk1, mk2Lat, mk2lng) {
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
// ********** END OF FUNCTIONALITY 3&4.

function setNearestBranches(outletsJSON) {
  // .slice(0) to pass array by value, leaving branches unaltered.
  let tempOutlets = outletsJSON.slice(0);

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

// ------------------------------------------------------

const http = require('http');
const express = require('express');

// const bodyParser = require('body-parser');
const app = express();

// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

const server = http.createServer(app);

app.use('/getNearestOutlets', (req, res) => {
  currentLocation = req.body;
  
  console.log('Req.body: ' + JSON.stringify(req.body));
  console.log(currentLocation);

  setOutletDistanceInJSON(currentLocation, outlets);

  setNearestBranches(outlets);

  res.statusCode = 200;
  res.set('Access-Control-Allow-Origin', '*');
  // res.setHeader('Content-Type', 'application/json; charset=utf-8'); 
  res.send(nearestOutlets);
  res.end();
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, (error) => {
  if (error) {
    console.log('Something went wrong', error);
  } else {
    console.log('Server is listening on port ' + PORT);
  }
});