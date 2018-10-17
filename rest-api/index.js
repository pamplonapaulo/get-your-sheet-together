'use strict';

var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;

var usersArray = [];

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// createUser(window.user):
app.post('/', function(req, res) {
            
    var matchFound = usersArray.some(hasExistingUser);

    function hasExistingUser(value, index, array) {        
        if (array[index].id === req.body.id){
            return array[index].id === req.body.id;
        }            
    }
        
    if (!matchFound){
        usersArray.push({
            index: usersArray.length,
            boards: [],
            id: req.body.id,
            name: req.body.name
        });
        console.log('!matchFound');
        console.log('usersArray: ' + usersArray);
    }
    
    matchFound = [];
    
    res.json({ message: 'success' });
});

// loadUserData(user):
app.get('/user/:id', function(req, res){

    var hasUser = usersArray.some(function(user){
        return user.id === req.params.id;
    });
    
    if(hasUser) {
        
        return res.json(usersArray.filter(function(user){
            return user.id === req.params.id;
        })[0]);    
    /*  usersArray.forEach(function(user) {            
            if(user.id === req.params.id){
                return res.json(user);
            }
        });*/
        
    }
    res.status(404).json({ error: 'Usuário não encontrado' });
});

// saveUserData():
app.post('/boards', function(req, res) {
    
    usersArray[req.body.index].boards = [];
    
    var boardsOnTransfer = req.body.boards;
            
    boardsOnTransfer.forEach(function(element) {
        usersArray[req.body.index].boards.push(element);
    });    
});

app.listen(port, function() {
  console.log('Listening on port http://localhost:%d', port);
});
