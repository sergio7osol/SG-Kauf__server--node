const chalk = require('chalk');
const fs = require('fs');
const find = require('lodash/find');
const serverConfigJSON = require('./server-project.config.json');

const BUY_DATA_DIR = __dirname + serverConfigJSON.buyDataDir;

function readReleaseTile(releaseDate) {
    const releases_str = fs.readFileSync(ReleasesIndex.PATH, 'utf8');
    const releases_arr = JSON.parse(releases_str);
    const release = _find(releases_arr, release => release.date === releaseDate);

    return release.title;
}

function addBuy(buyOptions) {
    // provided values
    const date = buyOptions.date;
    const time = buyOptions.time;
    // default values
    let currency = buyOptions.currency;
    let country = buyOptions.country;
    let payMethod = buyOptions['pay method'];
    let shopsName = buyOptions['shop\'s name'];
    let resultBuy = null;
    const filePath = BUY_DATA_DIR + date + '.json';
    
    // provided values -> green color; 
    // default values -> yellow color
    console.log('Date: ', chalk.green(date));
    console.log('Time: ', chalk.green(time));

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

    resultBuy = {
        date,
        time,
        currency,
        country,
        payMethod,
        shopsName
    };

    let fileContentsRaw = null;
    let buys = null;
    let resultBuys = null;
    let existingBuy = null;
    // const dataBuffer = fs.readFileSync("1-json.json").toString();

    try {
        fileContentsRaw = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        console.warn(chalk.hex("#ee7733")('No such file in the folder. Create default content for a new one.'));
        fileContentsRaw = '[]';
    }
    
    buys = JSON.parse(fileContentsRaw);
    
    // check whether the new buy is unique
    if (buys.length) {
        // searching for the unique buy - same date, same time
        existingBuy = find(buys, function(props) { 
            if (props.time === time) { 
                return true; 
            } 
        });

        if (existingBuy) {
            console.warn(chalk.hex("#ee7733")(`The buy of ${chalk.hex("#bb99aa")(date)} at ${chalk.hex("#bb99aa")(time)} already exists. Return.`));
            return false;
        }
    } 
 
    resultBuy.date = resultBuy.date.split('.').reverse().join('.');
    buys.push(resultBuy);
    resultBuys = JSON.stringify(buys);
    fs.writeFileSync(filePath, resultBuys);
}

function addProducts(date, time, products) {
    const filePath = BUY_DATA_DIR + date + '.json';
    let fileContentsRaw = null;
    let buys = null;
    let resultBuys = null;
    let existingBuy = null;
    let existingProducts = null;

    if (!products.length) {
        console.warn(chalk.hex("#ee7733")("No products provided. Return."));
        return;
    }

    try {
        fileContentsRaw = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        console.warn(chalk.hex("#ee7733")('No such file in the folder. Return.'));
        return;
    }

    buys = JSON.parse(fileContentsRaw);
    console.log('buys: ', buys);
    
    if (buys.length) {
        // searching for the unique buy - same date, same time
        existingBuy = find(buys, function(props) { 
            if (props.time === time) { 
                return true; 
            } 
        });

        if (!existingBuy) {
            console.warn(chalk.hex("#ee7733")(`The buy of ${chalk.hex("#bb99aa")(date)} at ${chalk.hex("#bb99aa")(time)} is not found. Return.`));
            return false;
        } else {
            existingProducts = existingBuy.products || [];

            products = JSON.parse(products);

            // products validation:
            products.forEach(product => {
                if (!(product.name && typeof product.name === 'string')) {
                    throw Error(chalk.red("product.name should be provided and be of a 'string' type. Program stops."));
                }

                if (!(product['weight/amount'] && typeof product['weight/amount'] === 'number')) {
                    throw Error(chalk.red("product['weight/amount'] should be provided and be of a 'number' type. Program stops."));
                }

                if (!(product.measure && typeof product.measure === 'string' && (product.measure === 'kg' || product.measure === 'piece'))) {
                    throw Error(chalk.red("product.measure should be provided and be of a 'string' type. Program stops."));
                }

                if (!(product.price && typeof product.price === 'number')) {
                    throw Error(chalk.red("product.price should be provided and be of a 'number' type. Program stops."));
                }
            });

            existingBuy.products = [].concat(existingProducts, products); // TODO: improve with validation of every product and add a possibility of choosing array/separat object
            
            resultBuys = JSON.stringify(buys);

            console.log('filePath: ', filePath);
            console.log('resultBuys: ', resultBuys);
            
            fs.writeFileSync(filePath, resultBuys);

            // provided values -> green color; 
            console.log('Date: ', chalk.green(date));
            console.log('Time: ', chalk.green(time));
            console.log('Products added:');
            products.map((v, i) => console.log(i+1, ' Name: ', chalk.green(v.name)));
        }
    } else {
        console.warn(chalk.hex("#ee7733")(`No buy entries found. End of function.`));
    }
}

function listAllDates() { // TODO: implement time range
    let dateFileNames = null;
    let resultDates = null;
    // console.warn(chalk.hex("#ee7733")(`The buy of ${chalk.hex("#bb99aa")(date)} at ${chalk.hex("#bb99aa")(time)} is not found. Return.`));

    try {
        dateFileNames = fs.readdirSync(BUY_DATA_DIR); //.filter(file => statSync(path.join(baseFolder, file)).isDirectory());

        debugger
        
        resultDates = dateFileNames.forEach(fileName => {
            const name = fileName.slice(0, -5).split('.').reverse().join('.'); // TODO: improve
            console.log(chalk.hex("#ee7733")(name));
        });

        return resultDates;
    } catch (err) {
        console.warn(chalk.hex("#ee7733")('No files in the folder. Return.'));
        console.error('ERROR: ', err);
        return;
    }

    // buys = JSON.parse(fileContentsRaw);
    // console.log('buys: ', buys);

}

module.exports = {
    addBuy, 
    addProducts,
    listAllDates
};