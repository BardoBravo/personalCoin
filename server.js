const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
var apiKey = '';

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/temp', function (req, res) {
    const formData = {
        "peers": [
            "peer0.org1.example.com",
            "peer1.org1.example.com"
        ],
        "chaincodeName" : "mycc",
        "chaincodePath" : "github.com/example_cc/go",
        "chaincodeType" : "golang",
        "chaincodeVersion" : "v0"
    };
    let url = `http://localhost:4000/channels/mychannel/chaincodes/mycc?peer=peer0.org1.example.com&fcn=query&args=["a"]`;
    request(url, function (err, response, body) {
        if(err){
            console.log(err);
            res.render('index', {response: null, error : 'Error, please try again'});
        } else {
            let response = body;
            console.log(response);
            if(response == null) {
                res.render('index', {response: null, error : 'Error, please try again'});
            } else {
                let responseText = response.substr(10,3);
                console.log(responseText);
                res.render('index', {response: responseText, error: null});
            }
        } 
    }).auth(null, null, true,apiKey);
});

app.post('/temp', function (req, res) {
    const formData = {
        "peers": [
            "peer0.org1.example.com",
            "peer1.org1.example.com"
        ],
        "fcn" : "move",
        "args" : [req.body.seller,"b", req.body.amount ]
    };
    let url = `http://localhost:4000/channels/mychannel/chaincodes/mycc`;
    request(url, function (err, response, body) {
        if(err){
            console.log(err);
            res.render('index', {response: null, error : 'Error, please try again'});
        } else {
            let response = body;
            console.log(response);
            if(response == null) {
                res.render('index', {response: null, error : 'Error, please try again'});
            } else {
                let url2 = `http://localhost:4000/channels/mychannel/chaincodes/mycc?peer=peer0.org1.example.com&fcn=query&args=["a"]`;
                request(url, function (err, response, body) {
                    if(err){
                        console.log(err);
                        res.render('index', {response: null, error : 'Error, please try again'});
                    } else {
                        let response = body;
                        console.log(response);
                        if(response == null) {
                            res.render('index', {response: null, error : 'Error, please try again'});
                        } else {
                            let responseText = response.substr(10,3);
                            console.log(responseText);
                            res.render('index', {response: responseText, error: null});
                        }
                    } 
                }).auth(null, null, true,apiKey);
            }
        } 
    }).auth(null, null, true,apiKey);
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

app.post('/createChannelRequest', function (req, res) {
    const formData = {
        channelName: 'mychannel',
        channelConfigPath: '../artifacts/channel/mychannel.tx'        
    };
    let url = `http://localhost:4000/channels`;
    request.post({url: url, form: formData}, function (err, response, body) {
        if(err){
            res.render('adminTasks', {response: null, error : 'Error, please try again'});
        } else {
            console.log(body);
            let response = JSON.parse(body)
            console.log(response);
            if(response.success == false) {
                res.render('adminTasks', {response: null, error : 'Error, please try again'});
            } else {
                let responseText = response.message;
                res.render('adminTasks', {response: responseText, error: null});
            }
        } 
    }).auth(null, null, true,apiKey);
});

app.post('/joinChannel', function(req, res) {
    const formData = {
        "peers": [
            "peer0.org1.example.com",
            "peer1.org1.example.com"
        ]
    };
    let url = `http://localhost:4000/channels/mychannel/peers`;
    request.post({url: url,
                  body: formData,
                  json: true
            },
            function (err, response, body) {
        if(err){
            console.log(err);
            res.render('adminTasks', {response: null, error : 'Error, please try again'});
        } else {
            console.log(body);
            let response = body;
            console.log(response);
            if(response.success == false) {
                res.render('adminTasks', {response: null, error : 'Error, please try again'});
            } else {
                let responseText = response.message;
                res.render('adminTasks', {response: responseText, error: null});
            }
        } 
    }).auth(null, null, true,apiKey);
})

app.post('/installChaincode', function(req, res) {
    const formData = {
        "peers": [
            "peer0.org1.example.com",
            "peer1.org1.example.com"
        ],
        "chaincodeName" : "mycc",
        "chaincodePath" : "github.com/example_cc/go",
        "chaincodeType" : "golang",
        "chaincodeVersion" : "v0"
    };
    let url = `http://localhost:4000/chaincodes`;
    request.post({url: url,
                  body: formData,
                  json: true
            },
            function (err, response, body) {
        if(err){
            console.log(err);
            res.render('adminTasks', {response: null, error : 'Error, please try again'});
        } else {
            let response = body;
            console.log(response);
            if(response.success == false) {
                res.render('adminTasks', {response: null, error : 'Error, please try again'});
            } else {
                let responseText = response.message;
                res.render('adminTasks', {response: responseText, error: null});
            }
        } 
    }).auth(null, null, true,apiKey);
})

app.post('/dashboard', function (req, res) {
    const formData = {
        "peers": [
            "peer0.org1.example.com",
            "peer1.org1.example.com"
        ],
        "chaincodeName" : "mycc",
        "chaincodeType" : "golang",
        "chaincodeVersion" : "v0",
        "args": ["a","100","b","200"]
    };
    let url = `http://localhost:4000/channels/mychannel/chaincodes`;
    request.post({url: url,
                  body: formData,
                  json: true
            },
            function (err, response, body) {
        if(err){
            console.log(err);
            res.render('dashboard', {data: null, error : 'Error, please try again'});
        } else {
            let data = body;
            console.log(response);
            if(data.success == false) {
                res.render('dashboard', {response: null, error : 'Error, please try again'});
            } else {
                let responseText = data.message;
                console.log(data.message);
                res.render('dashboard', {data: responseText, error: null})
            }
        } 
    } ).auth(null, null, true,apiKey);
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