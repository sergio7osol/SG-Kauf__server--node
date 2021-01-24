const express = require('express');
const path = require('path');
const hbs = require('hbs');
const chalk = require('chalk');
const cors = require('cors');
const serverConfigJSON = require('./server-project.config.json');
const { saveBuy, removeBuy, saveProduct, removeProducts, readDate, listAllDates } = require('./utils');

const port = process.env.PORT || 3000;
const whitelist = ['http://localhost:8080', 'http://localhost:8000', 'http://localhost:3030', 'http://10.0.2.15:8080', 'http://10.0.2.15:8000', 'http://10.0.2.15:3030'];

// Paths for express config
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const VIEWS_DIR = path.join(__dirname, '..', 'templates', 'views');
const PARTIALS_DIR = path.join(__dirname, '..', 'templates', 'partials');

const app = express();

app.set('view engine', 'hbs');
app.set('views', VIEWS_DIR);
hbs.registerPartials(PARTIALS_DIR);
app.use(express.static(PUBLIC_DIR));

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin 
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (whitelist.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

app.get('/with-cors', (req, res) => {

    console.log('cors >>', res.body);
  
    debugger
  
    // const data = JSON.stringify(req);
    const filePath = path.join(__dirname, '../../data/buys/new.json');
  
    const body = req.body;
  
    console.log("<create-release req.body>", body);
  
    fs.appendFile(filePath, body, (err) => {
      if (err) {
        console.log("Unable to append to new.json");
      }
    });
  
    // const fs.readFileSync();
  
    res.json({ msg: 'CORS Works! 🎉' })
  });

  app.post("/save-day", cors(), (req, res) => {

    const buy = req.body;
  
    console.log("<save-buy req.body>", buy);
    console.log("<save-buy req.body2>", res.body);
  
    // try {
    //     fs.writeFileSync(`${BUYS_DIR}/${buy.date}.json`, buy.info);
    //     console.log(`The buy day file "${buy.date}" was saved.`);
    // } catch (err) {
    //     console.error(err)
    // }
  
    // fs.appendFile("./data/buys.json", buy, (err) => {
    //     if (err) {
    //         console.log("Unable to append to notes.json");
    //     }
    // });
  
    // res.send(buy);
  });

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

debugger


// API
// Reading a day:
app.get('/read-date', ({url, query}, res) => {
    let statusMsg = null;
    let responseResult = null;
    let date = query.date; 

    // TODO: Format: 'DD.MM.YYYY'
    if (!date) {
        statusMsg = 'Date must be provided.';
        console.warn(chalk.yellow(url, ': '), chalk.red(statusMsg));

        return res.send({
            error: `${url}: ${statusMsg}`
        });
    }

    responseResult = readDate(date);

    return res.send(responseResult);    
});
// Adding a new buy:
app.get('/save-buy', ({url, query}, res) => {
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

    responseResult = saveBuy(query);

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
app.get('/save-product', ({url, query}, res) => {
    let statusMsg = null;
    let responseResult = null;

    // normalize price and weight to 'number' type:
    query.price = Number(query.price);
    query.weightAmount = Number(query.weightAmount);
    // query.discount = Number(query.discount); // TODO add % parsing
    query.discount = query.discount || 0;

    let { date, time, name, price, weightAmount, measure, description, discount } = query;

    console.log(chalk.yellow(`${url}: request`));


    console.log('date: ', date);
    console.log('time: ', time);
    console.log('name: ', name);
    console.log('price: ', price, typeof price);
    console.log('weightAmount: ', weightAmount, typeof weightAmount);
    console.log('measure: ', measure);
    console.log('description: ', description);
    console.log('discount: ', discount);

    if (!(date && time && name && price && weightAmount && measure && (discount || discount === 0))) {
        statusMsg = 'Date, time and product details must be provided.';
        console.warn(chalk.yellow(url, ': '), chalk.red(statusMsg));

        return res.send({
            success: false,
            error: `${url}: ${statusMsg}`
        });
    }

        

    responseResult = saveProduct(query);

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