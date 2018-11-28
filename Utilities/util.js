/*
* @Author: Ambuj Srivastava
* @Date: October 04, 2017
* @Last Modified by: Ambuj Srivastava
* @Last Modified On: October 26, 2017
*/


let config = require("./config").config,
    mustache = require('mustache'),
    bodyParser = require('body-parser'),
    nodemailer = require('nodemailer'),
    jwt = require('jsonwebtoken'),
    MD5 = require("md5");
    let templates = require('../Utilities/templates');
let querystring = require('querystring');


let encryptData = (stringToCrypt) => {
    return MD5(stringToCrypt);
};


// Define Error Codes
let statusCode = {
    ZERO: 0,
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
    SIX: 6,
    SEVEEN: 7,
    EIGHT: 8,
    NINE: 9,
    TEN: 10,
    OK: 200,
    FOUR_ZERO_FOUR: 404,
    INTERNAL_SERVER_ERROR:400,
    FOUR_ZERO_ZERO: 400,   
    BAD_REQUEST: 404,
    FIVE_ZERO_ZERO: 500
};

// Define Error Messages
let statusMessage = {
    PARAMS_MISSING: 'Mandatory Fields Missing',
    SERVER_BUSY: 'Our Servers are busy. Please try again later.',
    PAGE_NOT_FOUND: 'Page not found', //404
    PROFILE_UPDATE: 'Profile update Successfully.',
    POST_CREATE: 'Post create Successfully.',
    POST: 'All user post fetch Successfully.',
    INVALID_OTP : 'OTP is invalid, Please try again.',
    OTP_VERIFY_SUCCESS: ' Set your new password.',
    PASSWORD_CHANGED: 'Your Password has changed successfully.', 
    OTP_EXPIRED : 'Above otp has expired. Please try again.',
    DB_ERROR: 'database related error occured', // data base related error...
    GOT_AUDIO_LIST: "Got audio list Successfully",
    INTERNAL_SERVER_ERROR: 'Internal server error.', //500
    SOMETHING_WENT_WRONG: 'Something went wrong.',
    FETCHED_SUCCESSFULLY: 'Fetched Data Successfully.',
    UPLOAD_SUCCESSFUL: 'Uploaded Image Successfully.',
    USER_ADDED: "User created successfully.",
    STATUS_UPDATED: "Status updated successfully.",
    USERNAME_UPDATED: "UserName updated successfully.",
    LOGIN_SUCCESS: "Login Successfull.",
    USER_EXIST: "User already exists",
    USERNAME: "userName already exists",
    EMAIL_EXIST: "Email already exists",
    INCORRECT_CREDENTIALS: "Incorrect email or password.",
    INCORRECT_EMAIL :"Please enter correct email.",
    INCORRECT_PASSWORD :"Please enter correct password.",
    EMAIL_SENT :"email sent for password recovery.",
    INVALID_REQUEST :"Invalid Request.",
    INVALID_TOKEN : "User Authentication Failed. Please login again.",
    PASSWORD_UPDATED : "Congratulations! Password updated successfully.",
    MAX_DOWNLOADS: "Audio has already reached to its max number of downloads.",
    NO_SONG : "No any song available to show.",
    EMAIL_SENT_EBOOK : "email sent with ebook link.",
    PAYMENT_UPDATED : "Payment updated successfully.",
    ACCOUNT_RESTORED : "Account restored successfully.",
    LIKE_POST : "You like the post successfully",
    DEVICE_TOKEN_UPDATE : "Device token updated successfully.",
    FEED_COIN : "All user coin feed  post fetch Successfully.",
    UNSUBSCRIBE: "Unsubscribe successfully",
    INVALID_SUBSCRIPTION_ID : "Incorrect subscription Id.",
    INVALID_USER_ID : "Incorrect User id",
    SUBSCRIPTION_NOT_FOUND : "Subscription not found",
    ALREADY_SUBSCRIBE : "You already subscribe this post",
    ALREADY_UNSUBSCRIBE : "You already unsubscribe this post"

};

let getMysqlDate = (rawDate) => {
    let date = new Date(rawDate);
    return date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2);
}

let mailModule = nodemailer.createTransport(config.EMAIL_CONFIG);

let sendEmail =(data) => { 
    var mailOptions = {
        from : templates.mailTemplate.from,
        to : data.email,
        subject : templates.mailTemplate.subject,
        html : mustache.render(templates.mailTemplate.text,data)
    }
    console.log(mustache.render(templates.mailTemplate.text,data))
    mailModule.sendMail(mailOptions); 
}
let sendInvitationEmail =(data) => { 
    var mailOptions = {
        from : templates.mailTemplateInvitation.from,
        to : data.email,
        subject : templates.mailTemplateInvitation.subject,
        html : mustache.render(templates.mailTemplateInvitation.text,data)
    }
    console.log(mustache.render(templates.mailTemplateInvitation.text,data))
    mailModule.sendMail(mailOptions); 
}

let sendPdfEmail =(data) => { 
    var mailOptions = {
        from : templates.mail3Template.from,
        to : data.email,
        subject : templates.mail3Template.subject,
        html : mustache.render(templates.mail3Template.text)
    }
    //console.log(mustache.render(templates.mailTemplate.text,data))
    mailModule.sendMail(mailOptions); 
}

let sendVerificationEmail =(data) => { 
    var mailOptions = {
        from : templates.mail2Template.from,
        to : data.email,
        subject : templates.mail2Template.subject,
        html : mustache.render(templates.mail2Template.text,data)
    }
    console.log(mustache.render(templates.mailTemplate.text,data))
    mailModule.sendMail(mailOptions); 
}

let generateToken =() => {
    return Date.now()+Math.floor(Math.random()*99999)+1000;
}

let jwtDecode = (token, callback) => {
    jwt.verify(token, 'WAKITECHUGO', (err, decoded) => {
        // console.log("utitttototototo",err, decoded)
        if (err) {
            callback(null)
            // console.log(err)
        } else {
            callback(null, decoded.id)
        }
    })
}

let jwtEncode = (auth) => {
    // console.log("token generate")
    var token = jwt.sign({ id: auth }, 'WAKITECHUGO', {})
    return token;
}
module.exports = {
    statusCode: statusCode,
    statusMessage: statusMessage,
    getMysqlDate: getMysqlDate,
    encryptData: encryptData,
    sendEmail : sendEmail,
    sendInvitationEmail:sendInvitationEmail,
    sendVerificationEmail :sendVerificationEmail,
    generateToken : generateToken,
    sendPdfEmail : sendPdfEmail,
    jwtDecode : jwtDecode,
    jwtEncode : jwtEncode
}
