const request = require('request');

const geocode = (address, callback  ) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1Ijoic2VyZ2lvNzQ3IiwiYSI6ImNrMGF5MGY5dTBtaHkzY3BpdTRkbnk1dXYifQ.xUquJszDYbvOoCUN5D34TA&limit=1`;

  request({ url, json: true }, (error, { body }) => {
    let placeData = null;
    let resultData = null;

    if (error) { 
      callback("Unable to connect to location services.", undefined);
    } else if (body.error) {
      callback("Unable to find location. Try another search", undefined);
    } else {
      placeData = body.features[0];
console.log('remove');
      resultData = {
        latitude: placeData.center[1],
        longitude: placeData.center[0],
        location: placeData.place_name
      };

      callback(undefined, resultData);
    }
  });
};

const forecast = (latitude, longitude, callback) => {
  const url = `https://api.darksky.net/forecast/3c2fd92dec2343df5e5cb7fe9e87f934/${latitude},${longitude}?units=si`;

  request({ url, json: true }, (error, { body }) => {
    if (error) { 
      callback("Unable to connect to weather service.", undefined);
    } else if (body.error) {
      callback("Unable to find location.", undefined);
    } else {
      callback(undefined, body.currently);
    }
  });
};


module.exports = {
  geocode,
  forecast
};