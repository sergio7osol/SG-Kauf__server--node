const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const find = require('lodash/find');
const remove = require('lodash/remove');
const serverConfigJSON = require('./server-project.config.json');
const { type } = require('os');

const BUY_DATA_DIR = path.join(__dirname, '..', serverConfigJSON.buyDataDir);

function saveBuy(buyOptions) {
    // provided values
    const date = buyOptions.date;
    const time = buyOptions.time;
    // default values
    let currency = buyOptions.currency;
    let country = buyOptions.country;
    let index = buyOptions.index;
    let city = buyOptions.city;
    let street = buyOptions.street;
    let houseNumber = buyOptions.houseNumber;
    let payMethod = buyOptions.payMethod;
    let shopName = buyOptions.shopName;
    let resultBuy = null;
    const filePath = path.join(BUY_DATA_DIR, date + '.json');
    
    // provided values -> green color; 
    // default values -> yellow color
    console.log('Date: ', chalk.green(date));
    console.log('Time: ', chalk.green(time));

    debugger

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
        console.log('Country: ', chalk.yellow(country));
    }

    if (index) {
        console.log('Index: ', chalk.green(index));
    } else {
        index = '22307';
        console.log('Index: ', chalk.yellow(index));
    }

    if (city) {
        console.log('City: ', chalk.green(city));
    } else {
        city = 'Hamburg';
        console.log('City: ', chalk.yellow(city));
    }

    if (street) {
        console.log('Street: ', chalk.green(street));
    } else {
        street = 'Fuhlsbuettler Str.';
        console.log('Street: ', chalk.yellow(street));
    }

    if (houseNumber) {
        console.log('House number: ', chalk.green(houseNumber));
    } else {
        houseNumber = '387';
        console.log('House number: ', chalk.yellow(houseNumber));
    }

    if (payMethod) {
        console.log('Pay method: ', chalk.green(payMethod));
    } else {
        payMethod = 'EC card';
        console.log('Pay method: ', chalk.yellow(payMethod));
    }

    if (shopName) {
        console.log('Shop name: ', chalk.green(shopName));
    } else {
        shopName = 'REWE';
        console.log('Shop name: ', chalk.yellow(shopName));
    }

    resultBuy = {
        date,
        time,
        currency,
        country,
        address: {
            index,
            city,
            street,
            houseNumber
        },
        payMethod,
        shopName
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
            console.warn(chalk.hex("#ee7733")(`The buy of ${chalk.hex("#bb99aa")(date)} at ${chalk.hex("#bb99aa")(time)} exists. Overwrite it.`));

            existingBuy.currency = resultBuy.currency;
            existingBuy.country = resultBuy.country;
            existingBuy.address.city = resultBuy.address.city;
            existingBuy.address.index = resultBuy.address.index;
            existingBuy.address.street = resultBuy.address.street;
            existingBuy.address.houseNumber = resultBuy.address.houseNumber;
            existingBuy.payMethod = resultBuy.payMethod;
            existingBuy.shopName = resultBuy.shopName;

            resultBuys = JSON.stringify(buys);
            fs.writeFileSync(filePath, resultBuys);

            return {
                success: true,
                message: `The buy for ${date} at ${time} successfully saved.`
            };
        } else {
            console.warn(chalk.hex("#ee7733")(`The buy of ${chalk.hex("#bb99aa")(date)} at ${chalk.hex("#bb99aa")(time)} does not exist. Add the current one as a new one.`));
        }
    } 

    buys.push(resultBuy);
    resultBuys = JSON.stringify(buys);
    fs.writeFileSync(filePath, resultBuys);

    return {
        success: true,
        message: `The buy for ${date} at ${time} successfully saved.`
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
            
            console.warn(chalk.hex("#ee7733")(`The buy of ${chalk.hex("#bb99aa")(date)} at ${chalk.hex("#bb99aa")(time)} was successfully removed.`));

            if (!buys.length) {
                console.warn(chalk.hex("#ee7733")(`No buys left for the date ${chalk.hex("#bb99aa")(date)}. Deleting the file ${chalk.hex("#bb99aa")(filePath)} ...`));
                try {
                    fs.unlinkSync(filePath);
                    console.warn(chalk.hex("#ee7733")(`The file ${chalk.hex("#bb99aa")(filePath)} was successfully deleted.`));
                } catch (err) {
                    console.warn(chalk.hex("#ee7733")(`Error on deleting of file ${filePath}: ${err}`));

                    return {
                        success: false,
                        message: `On deleting of file ${filePath}: ${err}`
                    };
                }
            } else {
                resultBuys = JSON.stringify(buys);
                fs.writeFileSync(filePath, resultBuys);
            }
            
            return buys;

            // return {
            //     success: true,
            //     message: `The buy of ${date} at ${time} was successfully removed.`
            // };
        } else {
            return {
                success: false,
                message: `The buy of ${date} at ${time} was not found.`
            };
        }
    }

    return {
        success: false,
        message: `No buys of ${date} at ${time} were found.`
    };
}

function saveProduct({date, time, name, price, weightAmount, measure, description, discount}) {
    const filePath = path.join(BUY_DATA_DIR, date + '.json');
    let fileContentsRaw = null;
    let buys = null;
    let resultBuys = null;
    let existingBuy = null;
    let existingProducts = null;
    let product = null;

    if (!(name && typeof name === 'string')) {
        throw Error(chalk.red(`Product name should be provided and be of a 'string' type. Program stops.`));
    }
    if (!(price && typeof price === 'number')) {
        throw Error(chalk.red(`Product price should be provided and be of 'number' type. Program stops.`));
    }
    if (!(weightAmount && typeof weightAmount === 'number')) {
        throw Error(chalk.red(`Product weightAmount should be provided and be of a 'number' type. Program stops.`));
    }
    if (!((measure === 'kg' || measure === 'piece'))) {
        throw Error(chalk.red(`Product measure should be provided and be either 'kg' or 'piece' value. Program stops.`));
    }
    if (!(typeof discount === 'number' || typeof discount === 'string')) { // TODO parsing %
        throw Error(chalk.red(`Product discount should be provided and be of 'number' or 'string' type. Program stops.`));
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
        existingBuy = find(buys,  (props) => { 
            if (props.time === time) { 
                return true; 
            } 
        });

        if (!existingBuy) {
            console.warn(chalk.hex("#ee7733")(`The buy of ${chalk.hex("#bb99aa")(date)} at ${chalk.hex("#bb99aa")(time)} is not found. Return.`));
            return false;
        } else {
            existingProducts = existingBuy.products = existingBuy.products || [];

            // build a product consisting of corresponding buy values
            product = {
                name,
                price,
                weightAmount,
                measure,
                description,
                discount
            };

            // check whether there already is this product
            if (find(existingProducts, product)) {
                throw Error(chalk.red(`Products array already has such a product: ${product.name}. Program stops.`));
            }

            existingProducts.push(product); // TODO: improve with validation of every product and add a possibility of choosing array/separate object
            
            console.log('existingProducts >: ', existingProducts);

            resultBuys = JSON.stringify(buys);

            fs.writeFileSync(filePath, resultBuys);

            // provided values -> green color; 
            console.log('Product added: ', chalk.green(`The the product - ${product.name} - was successfully added to the buy of ${date} at ${time}.`));
            
            return existingProducts;
            // return {
            //     success: true,
            //     message: `The the product - ${productJSON.name} - was successfully added to the buy of ${date} at ${time}.`
            // };
        }
    } else {
        console.warn(chalk.hex("#ee7733")(`No buy entries found. End of function.`));
    }
}

function removeProduct({date, time, name, price, weightAmount, measure, description, discount}) {
    const filePath = path.join(BUY_DATA_DIR, date + '.json');
    let fileContentsRaw = null;
    let productToRemove = null;
    let buys = null;
    let resultBuys = null;
    let existingBuy = null;
    let existingProducts = null;
    let removedProduct = null;

    console.log('date: ', date);
    console.log('time: ', time);
    console.log('name: ', name);
    console.log('price: ', price);
    console.log('weightAmount: ', weightAmount);
    console.log('measure: ', measure);
    console.log('description: ', description);
    console.log('discount: ', discount);

    if (!(name && typeof name === 'string')) {
        throw Error(chalk.red(`Product name should be provided and be of a 'string' type. Program stops.`));
    }
    if (!(price && typeof price === 'number')) {
        throw Error(chalk.red(`Product price should be provided and be of 'number' type. Program stops.`));
    }
    if (!(weightAmount && typeof weightAmount === 'number')) {
        throw Error(chalk.red(`Product weightAmount should be provided and be of a 'number' type. Program stops.`));
    }
    if (!((measure === 'kg' || measure === 'piece'))) {
        throw Error(chalk.red(`Product measure should be provided and be either 'kg' or 'piece' value. Program stops.`));
    }
    if (!(typeof discount === 'number' || typeof discount === 'string')) { // TODO parsing %
        throw Error(chalk.red(`Product discount should be provided and be of 'number' or 'string' type. Program stops.`));
    }

    try {
        fileContentsRaw = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        const statusMsg = 'No such file in the folder. Return.';

        console.warn(chalk.hex("#ee7733")(statusMsg));

        return {
            success: false,
            error: `${url}: ${statusMsg}`
        };
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

            // TODO: add parsing %
            if (discount === '0') {
                discount = Number(discount);
            }

            // construct a product object
            productToRemove = {
                name,
                price, 
                measure,
                weightAmount,
                discount
            };

            if (description) {
                productToRemove.description = description;
            }

            console.log('existingProducts: ', existingProducts);
            console.log('productToRemove: ', productToRemove);

            // check whether the buy contains the product
            if (!find(existingProducts, productToRemove)) {
                throw Error(chalk.red(`Products array has no such product: ${productToRemove.name}. Program stops.`));
            } else {
                removedProduct = remove(existingProducts, productToRemove)[0];
            }

            resultBuys = JSON.stringify(buys);

            fs.writeFileSync(filePath, resultBuys);

            // provided values -> green color; 
            console.log('Date: ', chalk.green(date));
            console.log('Time: ', chalk.green(time));
            console.log(chalk.green('Product removed: '), 
                chalk.hex('#ee7733')(removedProduct.name), 
                chalk.green(', bought for '),
                chalk.hex('#ee7733')(removedProduct.price, removedProduct.currency),
                chalk.green(' for '),
                chalk.hex('#ee7733')(removedProduct.measure),
                chalk.green(' with '),
                chalk.hex('#ee7733')(removedProduct.discount),
                chalk.green(' discount.'));

            return existingProducts;
            // return {
            //     success: true,
            //     message: `The the product - ${removedProduct.name} - were successfully removed from the buy of ${date} at ${time}.`
            // };
        }
    } else {
        console.warn(chalk.hex("#ee7733")(`No buy entries found. End of function.`));
    }
}

function readDate(date) {
    let filePath = null;
    let buys = null;
    
    if (!date) {
        statusMsg = 'Date must be provided.';
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
            message: `The file for buy of ${date} is not found.`
        };
    }
    
    buys = JSON.parse(fileContentsRaw);
    
    // check whether there are any buys for this date
    if (buys.length) {
        return buys;
    }

    console.warn(chalk.hex("#ee7733")(`No buys for ${chalk.hex("#bb99aa")(date)} were found.`));
    
    return {
        success: false,
        message: `No buys for ${date} at ${time} were found.`
    };
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

function calculateWholeSum() {
    let dateFileNames = null;
    let fileContentsRaw = null;
    let resultSum = 0;

    try {
        dateFileNames = fs.readdirSync(BUY_DATA_DIR); //.filter(file => statSync(path.join(baseFolder, file)).isDirectory());
        resultSum = dateFileNames.reduce((dateSum, fileName) => {
            const filePath = path.join(BUY_DATA_DIR, fileName);
            console.log('fileName: ', fileName);
            
            try {
                fileContentsRaw = fs.readFileSync(filePath, 'utf8');
            } catch (err) {
                console.warn(chalk.hex("#ee7733")('No such file in the folder. Return.'));
                return;
            }
        
            buys = JSON.parse(fileContentsRaw);

            console.log('buys: ', buys.length);

            dateSum += buys.reduce((buySum, buy) => {
                const products = buy.products;

                if (products && products.length) {
                    buySum += products.reduce((productSum, product) => {
                        const price = product.price * product.weightAmount;

                        productSum += price;

                        return productSum;
                    }, 0)
                }

                console.log('buySum: ', buySum);
                
                return buySum;
            }, 0);

            console.log('dateSum: ', dateSum);

            return dateSum;
        }, 0);
        
        return resultSum;
    } catch (err) {
        console.warn(chalk.hex("#ee7733")('No files in the folder. Return.'));
        console.error('ERROR: ', err);
        return;
    }
}

module.exports = {
    saveBuy, 
    removeBuy,
    saveProduct,
    removeProduct,
    readDate,
    listAllDates,
    calculateWholeSum
};