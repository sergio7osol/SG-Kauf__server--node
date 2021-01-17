const request = require('postman-request');

const forecast = (latitude, longitude, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=e4b403a90aa3708c5a15e6b3677a24c7&query=${latitude},${longitude}&units=m`;

    request({ url, json: true }, function (error, response, {error:highLevelError, current} = {}) {
        if (error) {
            callback('Unable to connect to weather services', null);
        } else if (highLevelError) {
            callback('Unable to find location', null);
        } else {
            callback(null, {
                temperature: current.temperature,
                feelslike: current.feelslike,
                precip: current.precip,
                wind_speed: current.wind_speed,
                humidity: current.humidity
            });
        }
    });
}

module.exports = forecast;