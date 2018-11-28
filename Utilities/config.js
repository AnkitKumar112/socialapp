let environment = require('./environment').environment;
let serverURLs = require("./cred").serverURLs;

let config = {
    "DB_URL": {
        "host": `${serverURLs[environment].MYSQL_HOST}`,
        "user": `${serverURLs[environment].MYSQL_USER}`,
        "password": `${serverURLs[environment].MYSQL_PASSWORD}`,
        "database": `${serverURLs[environment].MYSQL_DATABASE}`
    },
    "EMAIL_CONFIG": {
        "host": `${serverURLs[environment].EMAIL_HOST}`,
        "port": `${serverURLs[environment].EMAIL_PORT}`,
        "secure": `${serverURLs[environment].EMAIL_SECURE}`,
        "auth": {
            "user": `${serverURLs[environment].EMAIL_USER}`,
            "pass": `${serverURLs[environment].EMAIL_PASS}`,
        }
    },
    "NODE_SERVER_PORT": {
        "port": `${serverURLs[environment].NODE_SERVER_PORT}`
    },
    "NODE_SERVER_URL": {
        "url": `${serverURLs[environment].NODE_SERVER}`
    }
};

let paypal2Config = {
      "port" : 5000,
      "api" : {
        "host" : "api.sandbox.paypal.com",
        "port" : "",            
        "client_id" : "AaLCmuqgAo-jy6t30kWVWWB7fxlKUSwWSmAV7VnMpl0OcT_aqiqfFoVFx1UAYWQfmNp_-OKoMqcmOQid",  // your paypal application client id
        "client_secret" : "EB0A3e12aOixakr5i0ZKMTnnCuhSnwmoWGgXSewICz7Rw-GTiWfuyDBOccuVy5z-gXHG7lTSGv8jUM_4" // your paypal application secret id
    },
    "returnUrl" : "http://www.tensiontempo.com/execute",
    "cancelUrl" : "http://www.tensiontempo.com/cancel"
}

let paypalConfig = {
      "port" : 5000,
      "api" : {
        "host" : "api.paypal.com",
        "port" : "",  
        "mode" : "live",            
        "client_id" : "AdTdWCaB9Coiu-ke8m6ZD2JBHrc3iJsuq8yA5CmII35yIZFLG5sya2hbgw5bDEkL5izdbay_95KcEx51",  // your paypal application client id
        "client_secret" : "EDVPxMv3QxTPoLUenx6ILECo-_5ia6pu9Q_RddPHuouxG4edVyf4ZYZEv0QOCU3otaxz1TfkYFvUl8JJ" // your paypal application secret id

    },
    "returnUrl" : "http://www.tensiontempo.com/execute",
    "cancelUrl" : "http://www.tensiontempo.com/cancel"
}


module.exports = {
    config: config,
    paypal2Config : paypal2Config,
    paypalConfig : paypalConfig
};
