const http = require('http');
const chalk = require('chalk');

const url = 'http://api.weatherstack.com/current?access_key=e4b403a90aa3708c5a15e6b3677a24c7&query=53.586917,9.966106&units=m';

const request = http.request(url, (response) => {
    let data = '';

    response.on('data', chunk => {
        data += chunk.toString();
    });
    
    response.on('end', () => {
        const body = JSON.parse(data);

        console.log('body: ', body);
    });
});

request.on('error', error => {
    console.warn(chalk.red(error));
});

request.end();