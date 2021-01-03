const fs = require('fs');
const chalk = require('chalk');
const yargs = require('yargs');
const serverConfigJSON = require('../server-project.config.json');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const BUY_DATA_DIR = __dirname + serverConfigJSON.buyDataDir;

// show weather forecast
yargs.command({
    command: 'show-weather',
    describe: 'Showing weather forecast',
    builder: {
        address: {
            describe: 'Show weather forecast for specified place.',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        console.log(chalk.yellow('/show-weather: console command'));

        geocode(argv.address, (error, data) => {
            if (error) {
                return console.error(chalk.red(error));
            } 
        
            Object.keys(data).forEach(el => {
                console.log(el + ': ' + chalk.yellow(data[el]));
            });
            console.log('----------------------------------------------'); 
        
            forecast(data.latitude, data.longitude, (error, forecastData) => {
                if (error) {
                    return console.error(chalk.red(error));
                }
        
                console.log(chalk.yellow(`Current temperature is ${forecastData.temperature}C, but it feels like ${forecastData.feelslike}C. There is a ${forecastData.precip}% chance of rain.`));
            });
        });
    }
});

yargs.parse();

