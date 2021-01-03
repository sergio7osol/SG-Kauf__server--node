const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const yargs = require('yargs');
const serverConfigJSON = require('./server-project.config.json');
const { addBuy, removeBuy, addProducts, removeProducts, listAllDates } = require('./utils');

const BUY_DATA_DIR = path.join(__dirname, serverConfigJSON.buyDataDir);

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
        console.log(chalk.yellow('/add-buy: console command'));

        addBuy(argv);
    }
});

// remove a buy
yargs.command({
    command: 'remove-buy',
    describe: 'Removing a buy',
    builder: {
        date: {
            describe: 'Date of the shopping trip buy. Format: DD.MM.YYYY',
            demandOption: true,
            type: 'string'
        },
        time: {
            describe: 'Time of the shopping trip buy. Format: HH:MM',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        console.log(chalk.yellow('/remove-buy: console command'));

        removeBuy(argv);
    }
});

// add products
yargs.command({
    command: 'add-products',
    describe: 'Adding bought products to the particular buy',
    builder: {
        date: {
            describe: 'Date of the shopping trip buy. Format: YYYY.MM.DD',
            demandOption: true,
            type: 'string'
        },
        time: {
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
    // attribute argv object:
    handler(argv) {
        console.log(chalk.yellow('/add-products: console command'));

        addProducts(argv);
    }
});

// remove products
yargs.command({
    command: 'remove-products',
    describe: 'Removing bought products from the particular buy',
    builder: {
        date: {
            describe: 'Date of the shopping trip buy. Format: YYYY.MM.DD',
            demandOption: true,
            type: 'string'
        },
        time: {
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
    // attribute argv object:
    handler(argv) {
        console.log(chalk.yellow('/remove-products: console command'));

        removeProducts(argv);
    }
});

// list all dates
yargs.command({
    command: 'list-dates',
    describe: 'List all buy dates',
    handler() {
        console.log(chalk.yellow('/list-dates: console command'));

        listAllDates();
    }

});

// TODO: implement remove dates and products for the date
// TODO: create saveBuy and loadBuy functions
yargs.parse();