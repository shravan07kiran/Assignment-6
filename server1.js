
// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: single, undef: true, unused: true, strict: true, trailing: true */
/* global socket:true*/
'use strict';
var express=require('express');
var app = express();
var server= require('http').createServer(app);
var io=require('socket.io').listen(server);


var http = require('http'),
    parser = require("body-parser"),
    movieDB = require('./modules/triviaDB'),
    MongoClient = require('mongodb').MongoClient,
    redis = require('redis'),
    client = redis.createClient(),
    assert = require('assert'),
    ObjectId = require('mongodb').ObjectID,
    app;


var users=[];
var connections=[];



server.listen(process.env.PORT || 3000);
console.log('server running...');
app.use(express.static('./'));
app.get('/', function(req,res){
    res.sendFile(__dirname+'/public/index.html'); 
});

  
function updateUsernames(){
        io.sockets.emit('get users',users);
}


 
io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log('connected: %s sockets connected', connections.length);

    //discounnect
    socket.on('disconnect', function(){
        
        users.splice(users.indexOf(socket.username),1);
        connections.splice(connections.indexOf(socket),1);
        console.log('Disconnected: %s sockets',connections.length) ;

    });
   

    //new user
    socket.on('new user',function(data,callback){
        callback(true);
        socket.username= data;
        users.push(socket.username);
        updateUsernames();
       

    });


   // io.sockets.emit('images',images);



    app.engine('.html', require('ejs').__express);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');

    client.set("right", 0);
    client.set("wrong", 0);

var jsonParser = parser.json({
    type: 'application/json'
});
var router = express.Router();

app.use(parser.urlencoded({
    extended: true
}));
app.use(parser.json());

var url = 'mongodb://localhost:27017/gamedatabase';

app.get('/question', function(req, res) {

    var findQuestions = function(db, callback) {

        var data = db.collection('gametable1').find().toArray(function(err, documents) {
            res.json(documents);
            db.close();
        });
    };
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        findQuestions(db, function() {});
    });
});

app.post('/question', function(req, res) {

    var question = req.body["question"];
    var answer = req.body["answer"];
   
    
    var insertDocument = function(db, callback) {

    

        db.collection('gametable1').insert({
            "question" : question,
            "answer" : answer
        });
    
        var data = db.collection('gametable1').find().toArray(function(err, documents) {

            res.json(documents);
                //db.close();
        });
    };

    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);

    
        insertDocument(db, function() {
            db.close();
        });
    });

});

app.post('/answer', function(req, res){

    var possible = req.body["possibleAns"];
    var id = req.body["answerId"];
    var actual = req.body["answer"];
    var correct;

            
    if(actual == possible){
                
        client.incr("right", function(err, reply){
            console.log("Right: " +reply);
        });
        res.json(true);
    }
        
    if(actual != possible){
            
        client.incr("wrong", function(err, reply){
            console.log("Wrong: " +reply);
        });
        res.json(false);
    }

});

app.get('/score', function(req, res){

    var right;
    var wrong;
    
    client.get("right", function(err, reply){
        right = reply;
        console.log("Right : "+right);

        client.get("wrong", function(err, reply){
            wrong = reply;
            console.log("Wrong : "+wrong);
                res.json({
                    "right" : right,
                    "wrong" : wrong
                });
        });

    });
});


require('./routes/index')(app);

});