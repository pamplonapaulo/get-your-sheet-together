'use strict';

var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;
var data = [];

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/boards', function(req, res) {
    
    data = [];
    
    var content = req.body;
        
    //console.log(req.body);
    console.log('número de boards: ' + req.body.length);
    
    content.forEach(function(element) {
        data.push(element);
    });
    data.forEach(function(element) {
        console.log(element);
    });
    
});

app.get('/boards', function(req, res) {
  res.json(data);
});

app.listen(port, function() {
  console.log('Listening on port http://localhost:%d', port);
});
