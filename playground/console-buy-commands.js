const fs = require('fs');
const chalk = require('chalk');
const yargs = require('yargs');
const serverConfigJSON = require('./server-project.config.json');
const { addBuy, addProducts } = require('./utils');

const BUY_DATA_DIR = __dirname + serverConfigJSON.buyDataDir;

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
    handler: function(argv) {
        // provided values
        const date = argv.date;
        const time = argv.time;
        // default values
        let currency = argv.currency;
        let country = argv.country;
        let payMethod = argv['pay method'];
        let shopsName = argv['shop\'s name'];
        let buyForSave = null;
        let buyForSaveJSON = null;
        let resultForSaveJSON = null;
        
        // provided values -> green color; 
        // default values -> yellow color
        console.log('Date: ', chalk.green(date));
        console.log('Time: ', chalk.green(argv.time));

        if (currency) {
            console.log('Currency: ', chalk.green(currency));
        } else {
            currency = 'EU';
            console.log('Currency: ', chalk.yellow(currency));
        }

        if (country) {
            console.log('Country: ', chalk.green(country));
        } else {
            country = 'Germany';
            console.log('Country: ', chalk.green(chalk.yellow(country)));
        }

        if (payMethod) {
            console.log('Pay method: ', chalk.green(chalk.green(payMethod)));
        } else {
            payMethod = 'EC card';
            console.log('Pay method: ', chalk.green(chalk.yellow(payMethod)));
        }

        if (shopsName) {
            console.log('Shop\'s name: ', chalk.green(chalk.green(shopsName)));
        } else {
            shopsName = 'REWE';
            console.log('Shop\'s name: ', chalk.green(chalk.yellow(shopsName)));
        }

        buyForSave = {
            date,
            time,
            currency,
            country,
            'pay method': payMethod,
            'shop\'s name': shopsName
        };

        addBuy(buyForSave);
    }
});

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
    handler: function(argv) {
        // provided values
        const date = argv.date;
        const time = argv.time;
        const products = argv.products;
        
        if (products.length) {
            addProducts(date, time, products);
        } else {
            console.warn(chalk.hex("#ee7733")("No products provided. Return."));
            return;
        }
    }
});

yargs.command({
    command: 'remove',
    describe: 'Removing a new buy',
    handler: function() {
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

yargs.command({
    command: 'list',
    describe: 'Listing all buys',
    handler: function() {
        console.log(chalk.yellow('Listing all buys...'));
    }

});

yargs.parse();