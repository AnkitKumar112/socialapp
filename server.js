/*
* @Author: Ambuj Srivastava
* @Date: October 04, 2018
* @Last Modified by: Ambuj Srivastava
* @Last Modified On: October 27, 2018
*/
   
   
   let app = require('express')(),
        express = require('express'),
        server = require('http').Server(app),
        mustache = require('mustache')
        bodyParser = require('body-parser'),
        path = require('path');

    require('./Utilities/dbConfig');

    let userRoute = require('./Routes/user'),
        util = require('./Utilities/util'),
        config = require("./Utilities/config").config;

    app.use("/media", express.static(path.join(__dirname, '/public')));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    
    app.use(express.static(__dirname + '/views'));
    //app.use(express.static(__dirname + './../ng'));
    app.set('view engine', 'ejs');


    app.use(function(err, req, res, next) {
        return res.send({ "errorCode": util.statusCode.FOUR_ZERO_ZERO, "errorMessage": util.statusMessage.SOMETHING_WENT_WRONG });
    });


    app.use('/user', userRoute);

    /*first API to check if server is running*/
    app.get('/', function(req, res) {
        res.send('hello, world!');
    });

    server.listen(config.NODE_SERVER_PORT.port,function(){
    	console.log('Server running on port ', config.NODE_SERVER_PORT.port);
    });
