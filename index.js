const fs = require('fs');
const express = require('express');
const crypto = require('crypto');
const yaml = require('js-yaml');
const app = express();

app.set('view engine', 'pug');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.render('index');
    res.status(200);
});

app.post('/v1/authorization', (req, res) => {
    const accounts = yaml.load(fs.readFileSync(__dirname + '/accounts.yaml'), 'utf-8').accounts;

    const sha1 = crypto.createHash('sha1');
    const hash = sha1.update(req.body.password).digest('hex');

    const account = accounts.find(item => item.login === req.body.login && item.password.toUpperCase() === hash.toUpperCase())

    if (account) {
        const token = req.headers.cookie;
        console.log(`token: ${token}`);
        res.set('access-token', token);
        res.redirect('/v1/cars');
    } else {
        const error = {
            text: 'Password or login is incorrect',
        }
        res.status(403).json(error);
    }
})

app.get('/v1/cars', (req, res) => {
    res
    const cars = [{
        id: 1,
        model: 'm3',
        price: 10000000,
        power: 500,
        description: null,
        brandName: 'BMW'
    }, {
        id: 2,
        model: 'm2 competition',
        price: 100000000,
        power: 1000,
        description: null,
        brandName: 'BMW'
    }]
    res.render('table', { taskList: cars });
})

app.use((req, res, next) => {
    res.status(404).json({
        message: 'Pade does not exist :)'
    })
})

app.listen(8080);