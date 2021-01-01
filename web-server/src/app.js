const express = require('express');
const path = require('path');
const hbs = require('hbs');

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

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        error: 'Page not found'
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});