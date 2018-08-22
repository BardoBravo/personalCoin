const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const apiKey = '09a9bc67c8eaeeb99fbbd34e29ceb317';

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/temp', function (req, res) {
    res.render('index', {weather: null, error: null});
});

app.post('/temp', function (req, res) {
    res.render('index', {weather: null, error: null});
});

app.get('/', function (req, res) {
    res.render('registerUser', {response: null, error: null});
});

app.post('/adminTasks', function (req, res) {
    let user = req.body.user;
    let organization = req.body.organization;
    const formData = {
        username: user,
        orgName: organization
    };
    let url = `http://localhost:4000/users`;
    request.post({url: url, form: formData}, function (err, response, body) {
        if(err){
            res.render('registerUser', {response: null, error : 'Error, please try again'});
        } else {
            console.log(body);
            let response = JSON.parse(body)
            console.log(response);
            if(response.success == false) {
                res.render('registerUser', {response: null, error : 'Error, please try again'});
            } else {
                apiKey = response.token;
                let responseText = response.message;
                res.render('adminTasks', {response: responseText, error: null});
            }
        }
    })
    
});

app.post('/dashboard', function (req, res) {
    res.render('dashboard', {weather: null, error: null});
});

app.post('/transferAmount', function (req, res) {
    res.render('transferAmount', {weather: null, error: null});
});

app.post('/', function (req, res) {
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    request(url, function (err, response, body) {
        if(err){
            res.render('index', {weather: null, error: 'Error, pleasetry again'});
        } else {
            let weather = JSON.parse(body)
            console.log(weather);
            if(weather.main == undefined) {
                res.render('index', {weather: null, error: 'Error, please try again'});
            } else {
                let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
                res.render('index', {weather: weatherText, error: null});
            }
        }        
    })
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});