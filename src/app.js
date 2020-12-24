const express = require('express');
const path = require('path');
const fs = require('fs');
const hbs = require('hbs');
const cors = require('cors');

const request = require('request');
const rp = require('request-promise');

const utils = require('../utils/weather');

const whitelist = ['http://localhost:3000'];

const app = express();
const port = process.env.PORT || 3001;

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

//allow OPTIONS on just one resource
// app.options('/the/resource/you/request', cors())
//allow OPTIONS on all resources
// app.use(cors());

const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

const BUYS_DIR = path.join(__dirname, '../data/buys');

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));

app.get('/get-day-info', (req, res) => {
  res.send("Hello Express!");
});

app.get('/weather', (req, res) => {

  if (!req.query.address) {
    return res.send({
      error: "You have to provide an address."
    });
  } else {
    // Hamburg Grandweg 154
    utils.geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
      if (error) {
        res.send({ error });
      } else {
        utils.forecast(latitude, longitude, (error, forecastData) => {
          if (error) {
            res.send(error);
          } else {
            forecastData.location = location;

            res.send(forecastData);
          }
        });
      }
    });
  }

  const getWeatherData = (latitude, longitude) => {
    const url = "https://api.darksky.net/forecast/3c2fd92dec2343df5e5cb7fe9e87f934/37.8267,-122.4233?units=si";

    request({ url, json: true }, (error, response) => {
      let dataToSend = null;

      if (error) {
        dataToSend = "Unable to connect to weather service.";
      } else if (response.body.error) {
        dataToSend = 'Unable to find location';
      } else {
        dataToSend = response.body.currently;
      }

      res.send(dataToSend);
    });
  }

  // returns an object { latitude: <value>, longitude: <value> } or a string error.
  const getGeoData = () => {
    const url = "https://api.mapbox.com/geocoding/v5/mapbox.places/Hamburg%20Grandweg%20154.json?access_token=pk.eyJ1Ijoic2VyZ2lvNzQ3IiwiYSI6ImNrMGF5MGY5dTBtaHkzY3BpdTRkbnk1dXYifQ.xUquJszDYbvOoCUN5D34TA&limit=1";

    request({ url, json: true }, (error, response) => {
      let placeData = null;
      let resultData = null;

      if (error) {
        resultData = "Unable to connect to location service.";
      } else if (!response.body.features.length) {
        resultData = "Unable to find location.";
      } else {
        placeData = response.body.features[0];
        resultData = {
          latitude: placeData.center[1],
          longitude: placeData.center[0]
        };
      }

      return resultData;
    });
  }

});

app.get('/help/*', (req, res) => {
  res.send("Help article not found");
});

app.post('/without-cors', (req, res, next) => {
  res.json({ msg: 'Works! 🎉' })
});

app.get('/with-cors', (req, res) => {

  console.log('cors >>', req.body);

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

app.get("/read-day", (req, res) => {
  const fileContent = fs.readFileSync(`${BUYS_DIR}/2019.07.03.json`, 'utf8');

  res.send(fileContent);
});

app.get("/all-files", (req, res) => {
  const buyDirectory = path.join(__dirname, '../data/buys');

  fs.readdir(buyDirectory, function (err, files) {
    let promises = null;

    if (err) {
      res.send('Error getting buy file names.');
    } else {
      promises = files.map((filename, index) => {
        return new Promise((resolve, reject) => {
          fs.readFile(`${buyDirectory}/${filename}`, (err, data) => {
            if (err) throw err;

            data = data.toString('utf-8');

            data = JSON.parse(data);

            resolve(data);
          });
        });
      });

      Promise.all(promises).then((content) => {
        res.send(content);
      })
    }
  })
});

app.get("/all-dates", (req, res) => {
    const buyDirectory = path.join(__dirname, '../data/buys');

    fs.readdir(buyDirectory, function (err, files) {
        let promises = null;

        if (err) {
            res.send('Error getting buy file names.');
        } else {
            promises = files.map((filename, index) => {
                return new Promise((resolve, reject) => {
                    resolve(filename);
                });
            });

            Promise.all(promises).then((content) => {
                res.send(content);
            })
        }
    })
});

app.get("/all-date-buys", (req, res) => {
    const buyDirectory = path.join(__dirname, '../data/buys');

    fs.readdir(buyDirectory, function (err, files) {
        let promises = null;

        if (err) {
            res.send('Error getting buy file names.');
        } else {
            promises = files.map((filename, index) => {
                return new Promise((resolve, reject) => {
                    fs.readFile(`${buyDirectory}/${filename}`, (err, data) => {
                        let newDataBuyMenu = null; 

                        if (err) throw err;
                        
                        data = data.toString('utf-8');
                        data = JSON.parse(data);
                        
                        if (!(data instanceof Array && data.length)) {
                            reject(new Error('No Array data in fetched request /all-date-buys'));
                        }
                        
                        newDataBuyMenu = data.reduce((acc, v, i) => {
                            if (!(v instanceof Object)) return false;
                            
                            if (i === 0) acc.date = v.date; 
                            
                            acc.times.push(v.time);

                            return acc;                            
                        }, {date: '', times: []});

                        resolve(newDataBuyMenu);
                    });
                });
            });

            Promise.all(promises).then((content) => {
                res.send(content);
            })
        }
    })
});


app.post("/save-day", cors(), (req, res) => {

  const buy = req.body;

  console.log("<save-buy req.body>", buy);

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
// save(releaseObj) {

//   return this.appendToIndex({
//       date: releaseObj.date,
//       title: releaseObj.title
//   });
// },

// if others pages were not found        
app.get("*", (req, res) => {
  res.render("404");
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});