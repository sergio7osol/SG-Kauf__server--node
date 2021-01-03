const express = require('express');
const path = require('path');
const hbs = require('hbs');
const chalk = require('chalk');
const serverConfigJSON = require('./server-project.config.json');
const { addBuy, removeBuy, addProducts, removeProducts, listAllDates } = require('./utils');

const port = process.env.PORT || 3000;

// Paths for express config
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const VIEWS_DIR = path.join(__dirname, '..', 'templates', 'views');
const PARTIALS_DIR = path.join(__dirname, '..', 'templates', 'partials');

const app = express();

app.set('view engine', 'hbs');
app.set('views', VIEWS_DIR);
hbs.registerPartials(PARTIALS_DIR);
app.use(express.static(PUBLIC_DIR));

app.get('', (req, res) => {
    res.render(path.join(VIEWS_DIR, 'index'), {
        mainColumn: 'SG-Kauf application',
        asideColumn: 'Weather application',
        name: 'Sergey Osokin' 
    });
});

app.get('/help', (req, res) => {
    res.send('<h1>Help page</h1>');
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        error: 'Help article not found'
    });
});

// API
// Adding a new buy:
app.get('/add-buy', ({url, query}, res) => {
    let statusMsg = null;
    let responseResult = null;

    // TODO: Format: 'DD.MM.YYYY'
    // TODO: Format: 'HH:MM'
    if (!(query.date && query.time)) {
        statusMsg = 'Date and time must be provided.';
        console.warn(chalk.yellow(url, ': '), chalk.red(statusMsg));

        return res.send({
            error: `${url}: ${statusMsg}`
        });
    }

    responseResult = addBuy(query);

    return res.send(responseResult);    

    // currency:
        // "EU"  -> default 
        // describe: 'Currency to pay for the buy',
        // type: 'string' // enum
    // country: {
        // "Germany"  -> default 
        // describe: 'Country of the shop',
        // type: 'string' // enum
    // 'pay method': {
        // "EC card" -> default 
        // describe: 'Pay method used for the buy',
        // type: 'string' // enum
    // 'shop\'s name': {
        // "REWE" -> default,
        // describe: 'Name of the shop, where the buy of products happened',
        // type: 'string' // enum
});

// Remove a buy:
app.get('/remove-buy', ({url, query}, res) => {
    let responseResult = null;
    // TODO: date Format: 'DD.MM.YYYY'
    // TODO: time Format: 'HH:MM'

    console.log(chalk.yellow(`${url}: request`));

    responseResult = removeBuy(query);

    return res.send(responseResult);    
});

// Add products to the buy:
app.get('/add-products', ({url, query}, res) => {
    let statusMsg = null;
    let responseResult = null;

    console.log(chalk.yellow(`${url}: request`));

    console.log('query.date: ', query.date);
    console.log('query.time: ', query.time);
    console.log('query.products: ', query.products);

    if (!(query.date && query.time && query.products)) {
        statusMsg = 'Date, time and products must be provided.';
        console.warn(chalk.yellow(url, ': '), chalk.red(statusMsg));

        return res.send({
            error: `${url}: ${statusMsg}`
        });
    }

    responseResult = addProducts(query);;

    return res.send(responseResult);    

    // currency:
        // "EU"  -> default 
        // describe: 'Currency to pay for the buy',
        // type: 'string' // enum
    // country: {
        // "Germany"  -> default 
        // describe: 'Country of the shop',
        // type: 'string' // enum
    // 'pay method': {
        // "EC card" -> default 
        // describe: 'Pay method used for the buy',
        // type: 'string' // enum
    // 'shop\'s name': {
        // "REWE" -> default,
        // describe: 'Name of the shop, where the buy of products happened',
        // type: 'string' // enum
});

// Remove products from the buy:
app.get('/remove-products', ({url, query}, res) => {
    let statusMsg = null;
    let responseResult = null;

    console.log(chalk.yellow(`${url}: request`));

    console.log('query.date: ', query.date);
    console.log('query.time: ', query.time);
    console.log('query.products: ', query.products);

    if (!(query.date && query.time && query.products)) {
        statusMsg = 'Date, time and products must be provided.';
        console.warn(chalk.yellow(url, ': '), chalk.red(statusMsg));

        return res.send({
            error: `${url}: ${statusMsg}`
        });
    }

    responseResult = removeProducts(query);

    return res.send(responseResult);    
});

// List all dates:
app.get('/list-dates', ({url}, res) => {
    let responseResult = null;
    
    console.log(chalk.yellow(`${url}: request`));

    responseResult = listAllDates();

    return res.send(responseResult);
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        error: 'Page not found'
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});