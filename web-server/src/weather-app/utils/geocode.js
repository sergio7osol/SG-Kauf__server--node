const request = require('postman-request');

const geocode = (encodedAddress, callback) => {
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=pk.eyJ1Ijoic2VyZ2lvb3NvbCIsImEiOiJja2phZnp1YjMyN3RiMnBudjJ3YWhncGxzIn0._zUul_PIg8jQk33HmUoWUA&limit=1`;

    request({ url: geocodeUrl, json: true }, function (error, response, { features } = {}) {
        if (error) {
            callback('Unable to connect to location services.', null);
        } else if (!features.length) {
            callback('Unable to find location. Try another search.', null);
            return false;
        } else {
            const infoItem = features[0];
            callback(null, {
                latitude: infoItem.center[1],
                longitude: infoItem.center[0],
                location: infoItem.place_name
            });
        }
    });
}

module.exports = geocode;