const fs = require('fs');
const chalk = require('chalk');
const yargs = require('yargs');
const serverConfigJSON = require('./server-project.config.json');
const { addBuy, addProducts, listAllDates } = require('./utils');

const BUY_DATA_DIR = __dirname + serverConfigJSON.buyDataDir;

// add a buy
yargs.command({
    command: 'add-buy',
    describe: 'Adding a new buy',
    builder: {
        date: {
            // string
            describe: 'Date of the shopping trip buy. Format: DD.MM.YYYY',
            demandOption: true,
            type: 'string'
        },
        time: {
            // string
            describe: 'Time of the shopping trip buy. Format: HH:MM',
            demandOption: true,
            type: 'string'
        },
        currency: {
            // "EU"  -> default 
            describe: 'Currency to pay for the buy',
            type: 'string' // enum
        },
        country: {
            // "Germany"  -> default 
            describe: 'Country of the shop',
            type: 'string' // enum
        },
        'pay method': {
            // "EC card" -> default 
            describe: 'Pay method used for the buy',
            type: 'string' // enum
        },
        'shop\'s name': {
            // "REWE" -> default,
            describe: 'Name of the shop, where the buy of products happened',
            type: 'string' // enum
        }
    },
    handler(argv) {
        addBuy(argv);
    }
});

// add products
yargs.command({
    command: 'add-products',
    describe: 'Adding bought products for a particular buy',
    builder: {
        date: {
            // string
            describe: 'Date of the shopping trip buy. Format: YYYY.MM.DD',
            demandOption: true,
            type: 'string'
        },
        time: {
            // string
            describe: 'Time of the shopping trip buy. Format: HH:MM',
            demandOption: true,
            type: 'string'
        },
        products: {
            describe: 'Bought products for the buy',
            demandOption: true,
            type: 'array'
        }
    },
    handler(argv) {
        // provided values
        const date = argv.date;
        const time = argv.time;
        const products = argv.products;
        
        addProducts(date, time, products);
    }
});

yargs.command({
    command: 'remove',
    describe: 'Removing a new buy',
    handler() {
        console.log(chalk.red.bold('Removing a buy...'));
    }

});

yargs.command({
    command: 'read',
    describe: 'Reading a new buy',
    handler: function() {
        console.log(chalk.yellow('Reading a buy...'));
    }

});

// list all dates
yargs.command({
    command: 'list-dates',
    describe: 'List all buy dates',
    handler() {
        listAllDates();
    }

});

// TODO: implement remove dates and products for the date
// TODO: create saveBuy and loadBuy functions
yargs.parse();