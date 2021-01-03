const request = require('postman-request');

const forecast = (latitude, longitude, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=e4b403a90aa3708c5a15e6b3677a24c7&query=${latitude},${longitude}&units=m`;

    request({ url, json: true }, function (error, response, body) {
        if (error) {
            callback('Unable to connect to weather services', null);
        } else if (body && body.error) {
            callback('Unable to find location', null);
        } else {
            callback(null, {
                temperature: body.current.temperature,
                feelslike: body.current.feelslike,
                precip: body.current.precip
            });
        }
    });
}

module.exports = forecast;