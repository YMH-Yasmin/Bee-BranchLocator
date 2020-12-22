var outlets,
  currentLocation,
  nearestOutlets = [];

outlets = require('../outlets.json');

// ********** FUNCTIONALITY 3&4 - Get & Set Outlet distances.
function setOutletDistanceinJSON(currentLoc, outletsJSON) {
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

const server = http.createServer();
const PORT = process.env.PORT || 5000;

server.on('http://localhost:5000/', (request, response) => {
  console.log('here');
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.write('Hello World!');
  response.end();
});

// server.on('/getNearestOutlets', (request, response) => {
//   const { headers, method, url } = request;

//   let body = [];

//   request
//     .on('data', (chunk) => {
//       body.push(chunk);
//     })
//     .on('end', () => {
//       body = Buffer.concat(body).toString();
//       // At this point, `body` has the entire request body stored in it as a string
//     });

//   request.on('error', (err) => {
//     // This prints the error message and stack trace to `stderr`.
//     console.error(err.stack);
//   });

//   console.log(body);
// });

server.listen(PORT, handlePortListen);

// function handleRequest(req, res) {
//   res.writeHead(200, { 'Content-Type': 'text/plain' });

//   currentLocation = {
//     lat: 30.064639999999994,
//     lng: 31.319654399999994,
//   };
//   res.write(nearestOutlets);
//   res.end();
// }

function handlePortListen(error) {
  if (error) {
    console.log('Something went wrong', error);
  } else {
    console.log('Server is listening on port ' + PORT);
  }
}

// const express = require("express");
// const http = require("http");

// const hostname = "localhost";
// const port = 3000;

// const bodyParser = require("body-parser");

// const app = express();

// app.use(bodyParser.json());

// app.use((req,res) => {
//   const body = req.body;
//   console.log(body);
//   res.statusCode = 200;
//   res.setHeader("Content-Type","application/json");
//   res.json(body);
// });

// const server = http.createServer(app);

// server.listen(port, hostname, () => {
//   console.log("Server Running");
// });
