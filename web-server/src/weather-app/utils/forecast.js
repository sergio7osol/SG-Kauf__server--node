const request = require('postman-request');

const forecast = (latitude, longitude, location, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=d964a09b81ea0d5acf90bae55e348750&query=${latitude},${longitude}&units=m`;

    request({ url, json: true }, function (error, response, body) {
        const {error: highLevelError, current} = body;
        if (error) {
            callback('Unable to connect to weather services.', null);
        } else if (highLevelError) { 
            callback('Unable to find location.', null);
        } else {
            callback(null, {
                temperature: current.temperature,
                feelslike: current.feelslike,
                precip: current.precip,
                wind_speed: current.wind_speed,
                humidity: current.humidity,
                description: current.weather_descriptions[0],
                observationTime: current.observation_time, 
                location
            });
        }
    });
}

module.exports = forecast; 