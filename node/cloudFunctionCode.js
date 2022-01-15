// Cloud Function Code

var outlets;

const axios = require("axios");

const getOutlets = async () => {
  try {
    return await axios.get("https://storageURL.json");
  } catch (error) {
    console.log("Failed to fetch outlets.");
    console.error(error);
  }
};

const setOutlets = async () => {
  outlets = await getOutlets();
};

setOutlets();

exports.outletLocator = (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  if (!req.body) {
    res.status(400).send("The server could not process the request.");
    return;
  }

  // currentLocation = req.body;
  var nearestOutlets = [];

  if (!outlets) {
    console.log(`Failed to fetch outlets.`);
    setTimeout(() => {
      setOutletDistanceInJSON(req.body, outlets.data);
      nearestOutlets = getNearestBranches(outlets.data);
      res.status(200).send(nearestOutlets).end();
    }, 5000);
  } else {
    setOutletDistanceInJSON(req.body, outlets.data);
    nearestOutlets = getNearestBranches(outlets.data);
    res.status(200).send(nearestOutlets).end();
  }
};

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

function getNearestBranches(outletsJSON) {
  // .slice(0) to copy array by value, leaving 'outlets' unaltered.
  let tempOutlets = outletsJSON.slice(0);

  tempOutlets.sort(function (x, y) {
    return x.distance - y.distance;
  });

  return tempOutlets.slice(0, 5);
}