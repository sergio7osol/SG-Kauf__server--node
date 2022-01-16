const chalk = require('chalk');
const geocode = require('./geocode');
const forecast = require('./forecast');

const getForecast = encodedAddress => {
    return new Promise(resolve => {
        geocode(encodedAddress, (error, geocodeData) => {
            if (error) {
                return console.error(chalk.red(error));
            }

            Object.keys(geocodeData).forEach(prop => {
                console.log(prop + ': ' + chalk.yellow(geocodeData[prop]));
            });
            console.log('----------------------------------------------');

            resolve(geocodeData); 
        });
    })
    .then(geocodeData => {
        return new Promise((resolve, reject) => {
            forecast(geocodeData.latitude, geocodeData.longitude, geocodeData.location, (error, forecastData) => {
                if (error) {
                    console.error(chalk.red(error));
                    reject(error);
                }
                const { temperature, feelslike, precip, location } = forecastData;

                console.log(chalk.yellow('Location: ', geocodeData.location));
                console.log(chalk.yellow('Current temperature is ' + chalk.green(temperature) + 'C'
                    + ', but it feels like ' + chalk.green(String(feelslike)) + 'C.'
                    + ' There is a ' + chalk.green(precip) + '% chance of rain'));

                resolve(forecastData);
            });
        });
    })
    .catch(error => {
        console.error(error);
        return {
            success: false,
            error
        };
    });
};

module.exports = {
    getForecast
};
