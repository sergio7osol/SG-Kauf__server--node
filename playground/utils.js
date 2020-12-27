const chalk = require('chalk');
const fs = require('fs');
const find = require('lodash/find');
const serverConfigJSON = require('./server-project.config.json');

const BUY_DATA_DIR = __dirname + serverConfigJSON.buyDataDir;

function readReleaseFile(release) {
    return fs.readFileSync(`${RELEASES_DIR}/${release}`, 'utf8')
}
function readReleaseTile(releaseDate) {
    const releases_str = fs.readFileSync(ReleasesIndex.PATH, 'utf8');
    const releases_arr = JSON.parse(releases_str);
    const release = _find(releases_arr, release => release.date === releaseDate);

    console.log("release.title>> ", release.title);

    return release.title;
}

function addBuy(buy) {
    const filePath = BUY_DATA_DIR + buy.date + '.json';
    const time = buy.time;
    let fileContentsRaw = null;
    let buys = null;
    let resultBuys = null;
    let existingBuy = null;
    // const dataBuffer = fs.readFileSync("1-json.json").toString();

    try {
        fileContentsRaw = fs.readFileSync(filePath, 'utf8');
        console.log('fileContents try: ', fileContentsRaw);
    } catch (err) {
        console.warn(chalk.hex("#ee7733")('No such file in the folder. Create default content for a new one.'));
        fileContentsRaw = '[]';
    }
    
    buys = JSON.parse(fileContentsRaw);

    if (buys.length) {
        // searching for the unique buy - same date, same time
        existingBuy = find(buys, function(props) { 
            if (props.time === buy.time) { 
                return true; 
            } 
        });

        if (existingBuy) {
            console.warn(chalk.hex("#ee7733")(`The buy of ${chalk.hex("#bb99aa")(buy.date)} at ${chalk.hex("#bb99aa")(buy.time)} already exists. Return.`));
            return false;
        }
    } else {
        buy.date = buy.date.split('.').reverse().join('.');
        buys.push(buy);
        resultBuys = JSON.stringify(buys);
        fs.writeFileSync(filePath, resultBuys);
    }
}

function addProducts(date, time, products) {
    const filePath = BUY_DATA_DIR + date + '.json';
    let fileContentsRaw = null;
    let buys = null;
    let resultBuys = null;
    let existingBuy = null;
    let existingProducts = null;

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
            products.map((v, i) => console.log(i+1, ' Name: ', chalk.green(v.name)));
        }
    } else {
        console.warn(chalk.hex("#ee7733")(`No buy entries found. End of function.`));
    }
}

module.exports = {
    addBuy, 
    addProducts
};