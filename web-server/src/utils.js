const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const find = require('lodash/find');
const remove = require('lodash/remove');
const serverConfigJSON = require('./server-project.config.json');

const BUY_DATA_DIR = path.join(__dirname, '..', serverConfigJSON.buyDataDir);

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
    const filePath = path.join(BUY_DATA_DIR, date + '.json');
    
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
            return {
                success: false,
                message: `The buy of ${date} at ${time} already exists.`
            };
        }
    } 
 
    buys.push(resultBuy);
    resultBuys = JSON.stringify(buys);
    fs.writeFileSync(filePath, resultBuys);

    return {
        success: true,
        message: `The buy for ${date} at ${time} successfully created.`
    };
}

function removeBuy({date, time}) {
    let filePath = null;
    let buys = null;
    
    if (!(date && time)) {
        statusMsg = 'Date and time must be provided.';
        console.warn(chalk.red(statusMsg));

        return {
            success: false,
            message: statusMsg
        };
    }

    filePath = path.join(BUY_DATA_DIR, date + '.json');

    try {
        fileContentsRaw = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        console.warn(chalk.hex("#ee7733")('No such file in the folder. Return.'));
        
        return {
            success: false,
            message: `The file for buy of ${date} at ${time} is not found.`
        };
    }
    
    buys = JSON.parse(fileContentsRaw);
    
    // check whether there are any buys for this date
    if (buys.length) {
        // searching for the unique buy - same date, same time
        existingBuy = find(buys, function(props, i, src) {
            if (props.time === time) { 
                console.warn(chalk.hex("#ee7733")(`The buy of ${chalk.hex("#bb99aa")(date)} at ${chalk.hex("#bb99aa")(time)} is found. Removing it...`));

                return true; 
            } 
        });
        // the needed buy is found. Remove it
        if (existingBuy) {
            remove(buys, existingBuy);

            resultBuys = JSON.stringify(buys);
            fs.writeFileSync(filePath, resultBuys);

            console.warn(chalk.hex("#ee7733")(`The buy of ${chalk.hex("#bb99aa")(date)} at ${chalk.hex("#bb99aa")(time)} was successfully removed.`));
            
            return {
                success: true,
                message: `The buy of ${date} at ${time} was successfully removed.`
            };
        }
    }

    return {
        success: false,
        message: `No buys of ${date} at ${time} were found.`
    };
}

function addProducts({date, time, products}) {
    const filePath = path.join(BUY_DATA_DIR, date + '.json');
    let fileContentsRaw = null;
    let buys = null;
    let resultBuys = null;
    let existingBuy = null;
    let existingProducts = null;
    const productsJSON = JSON.parse(products);
    let productNames = null;

    console.log('date: ', date);
    console.log('time: ', time);
    console.log('products: ', productsJSON);
    if (!(date && time && productsJSON && productsJSON.length)) {
        console.warn(chalk.hex("#ee7733")("Date, time and products must be provided. Return."));
        return;
    }

    try {
        fileContentsRaw = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        console.warn(chalk.hex("#ee7733")('No such file in the folder. Return.'));
        return;
    }

    buys = JSON.parse(fileContentsRaw);
    
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
            existingProducts = existingBuy.products = existingBuy.products || [];

            // products validation:
            productsJSON.forEach(product => {
                if (!(product.name && typeof product.name === 'string')) {
                    throw Error(chalk.red(`Product name should be provided and be of a 'string' type. Program stops.`));
                }
                
                if (!(product['weight/amount'] && typeof product['weight/amount'] === 'number')) {
                    throw Error(chalk.red(`Product weight/amount should be provided and be of a 'number' type. Program stops.`));
                }
                
                if (!(product.measure && (product.measure === 'kg' || product.measure === 'piece'))) {
                    throw Error(chalk.red(`Product measure should be provided and be either 'kg' or 'piece' value. Program stops.`));
                }
                
                if (!(product.price && typeof product.price === 'number')) {
                    throw Error(chalk.red(`Product price should be provided and be of 'number' type. Program stops.`));
                }
                
                // check whether there already is this product
                if (find(existingProducts, product)) {
                    throw Error(chalk.red(`Products array already has such a product: ${product.name}. Program stops.`));
                }
            });

            existingBuy.products = [].concat(existingProducts, productsJSON); // TODO: improve with validation of every product and add a possibility of choosing array/separat object
            
            resultBuys = JSON.stringify(buys);

            fs.writeFileSync(filePath, resultBuys);

            // provided values -> green color; 
            console.log('Date: ', chalk.green(date));
            console.log('Time: ', chalk.green(time));
            console.log('Products added:');
            productsJSON.map((v, i) => console.log(i+1, ' Name: ', chalk.green(v.name)));

            productNames = productsJSON.map((v, i) => v.name).join(', ');

            return {
                success: true,
                message: `The the product(-s) - ${productNames} - were successfully added to the buy of ${date} at ${time}.`
            };
        }
    } else {
        console.warn(chalk.hex("#ee7733")(`No buy entries found. End of function.`));
    }
}

function removeProducts({date, time, products}) {
    const filePath = path.join(BUY_DATA_DIR, date + '.json');
    let fileContentsRaw = null;
    let buys = null;
    let resultBuys = null;
    let existingBuy = null;
    let existingProducts = null;
    const productsJSON = JSON.parse(products);
    let removedProducts = null;
    let productNames = null;

    console.log('date: ', date);
    console.log('time: ', time);
    console.log('products: ', productsJSON);
    if (!(date && time && productsJSON && productsJSON.length)) {
        console.warn(chalk.hex("#ee7733")("Date, time and products must be provided. Return."));
        return;
    }

    try {
        fileContentsRaw = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        console.warn(chalk.hex("#ee7733")('No such file in the folder. Return.'));
        return;
    }

    buys = JSON.parse(fileContentsRaw);
    
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
            existingProducts = existingBuy.products = existingBuy.products || [];

            // products validation:
            productsJSON.forEach(product => {
                if (!(product.name && typeof product.name === 'string')) {
                    throw Error(chalk.red(`Product name should be provided and be of a 'string' type. Program stops.`));
                }
                
                if (!(product['weight/amount'] && typeof product['weight/amount'] === 'number')) {
                    throw Error(chalk.red(`Product weight/amount should be provided and be of a 'number' type. Program stops.`));
                }
                
                if (!(product.measure && (product.measure === 'kg' || product.measure === 'piece'))) {
                    throw Error(chalk.red(`Product measure should be provided and be either 'kg' or 'piece' value. Program stops.`));
                }
                
                if (!(product.price && typeof product.price === 'number')) {
                    throw Error(chalk.red(`Product price should be provided and be of 'number' type. Program stops.`));
                }
                
                // check whether the buy contains the product
                if (!find(existingProducts, product)) {
                    throw Error(chalk.red(`Products array has no such product: ${product.name}. Program stops.`));
                } else {
                    removedProducts = remove(existingProducts, product);
                }
            });

            resultBuys = JSON.stringify(buys);

            fs.writeFileSync(filePath, resultBuys);

            // provided values -> green color; 
            console.log('Date: ', chalk.green(date));
            console.log('Time: ', chalk.green(time));
            console.log('Products removed:');
            removedProducts.map((v, i) => console.log(i+1, ' Name: ', chalk.green(v.name)));

            productNames = removedProducts.map((v, i) => v.name).join(', ');

            return {
                success: true,
                message: `The the product(-s) - ${productNames} - were successfully removed from the buy of ${date} at ${time}.`
            };
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
        resultDates = dateFileNames.map(fileName => {
            const name = fileName.slice(0, -5); // TODO: improve
            console.log(chalk.hex("#ee7733")(name));

            return name;
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
    removeBuy,
    addProducts,
    removeProducts,
    listAllDates
};