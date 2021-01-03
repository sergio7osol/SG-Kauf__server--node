const request = require('postman-request');

const geocode = (address, callback) => {
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1Ijoic2VyZ2lvb3NvbCIsImEiOiJja2phZnp1YjMyN3RiMnBudjJ3YWhncGxzIn0._zUul_PIg8jQk33HmUoWUA`;

    request({ url: geocodeUrl, json: true }, function (error, response, {features} = {}) {
        if (error) {
            callback('Unable to connect to location services', null);
        } else if (!features.length) {
            callback('Unable to find location. Try another search.', null);
            return false;
        } else {
            callback(null, {
                latitude: features[0].center[1],
                longitude: features[0].center[0],
                location: features[0].place_name
            });
        }
    });
}

module.exports = geocode;