const chalk = require('chalk');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

geocode('Hamburg Grandweg 154', (error, data) => {
    if (error) {
        return console.error(chalk.red(error));
    } 

    Object.keys(data).forEach(el => {
        console.log(el + ': ' + chalk.yellow(data[el]));
    });
    console.log('----------------------------------------------'); 

    forecast(data.latitude, data.longitude, (error, {temperature, feelslike, precip} = {}) => {
        if (error) {
            return console.error(chalk.red(error));
        }

        console.log(chalk.yellow(`Current temperature is ${temperature}C, but it feels like ${feelslike}C. There is a ${precip}% chance of rain.`));
    });
});


