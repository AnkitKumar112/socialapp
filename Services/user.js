/*
* @Author: Ambuj Srivastava
* @Date: October 04, 2018
* @Last Modified by: Ambuj Srivastava
* @Last Modified On: November 16, 2018
*/


let async = require('async'),
    queryString = require('querystring'),
    jwt = require('jsonwebtoken');


let util = require('../Utilities/util'),
    config = require('../Utilities/Config'),
    userDAO = require('../DAO/userDAO');

let FCM = require('fcm-node');
let serverKey = require('../Utilities/socialapp-key.json') //'e1UgwxiZF8g:APA91bE_2kZr13EMUNe9G0LW3f-i6W7aDEdPEwGmu4tmdoiOjHfV0hSl4OnVdLESSKul_trq5-fYWyUXivJLJeSFTONDE1_y5JpZLd8afxaMUFgtVfGoVfuJ65kinN9bqwVDU1v_PZfe'; //put your server key here
let fcm = new FCM(serverKey);

let serverUrl = ""//config.config.NODE_SERVER_URL.url+":"+config.config.NODE_SERVER_PORT.port

/* signup API */
let signup = (data, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.email || !data.userName) {
                cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var criteria = {
                email: data.email
            }
            userDAO.getUsers(criteria, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
                    return;
                } else {

                    if (dbData && dbData.length > 0) {
                        cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.EMAIL_EXIST });
                        return;
                    }
                    else {
                        let criteria2 = {
                            userName: data.userName
                        }
                        userDAO.getUsers(criteria2, (err, dbData2) => {
                            if (dbData2 && dbData2.length > 0) {
                                cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.USERNAME });
                                return;
                            }
                            else {
                                // proceed for signp.....
                                cb(null, {});
                            }
                        })
                    }
                }
            });
        },
        createUserinDB: ['checkUserExistsinDB', (cb, functionData) => {
            if (functionData && functionData.checkUserExistsinDB && functionData.checkUserExistsinDB.statusCode) {
                cb(null, functionData.checkUserExistsinDB);
                return;
            }

            let UserData = {
                "userName": data.userName,
                "fullName": data.fullName,
                "password": util.encryptData(data.password),
                "email": data.email,
                "facebookId": data.facebookId ? data.facebookId : '0',
                "googleId": data.googleId ? data.googleId : '',
                "forgotToken": data.forgotToken ? data.forgotToken : '0',
                "forgotOTP": data.forgotOTP ? data.forgotOTP : '0'

            }

            userDAO.createUser(UserData, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }

                let criteria = {
                    email: data.email
                }
                userDAO.getUsers(criteria, (err, dbData) => {
                    if (err) {
                        cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
                        return;
                    }
                    dataToSet = {
                        "userId": dbData[0].userId
                    }
                    userDAO.createUserInfo(dataToSet, (err, dbData) => {
                        cb(null)
                    });
                    if (dbData && dbData.length) {
                        console.log("rahgu", dbData[0].userId)
                        let obj = {};
                        obj.usrId =  dbData[0].userId
                        obj.userName = dbData[0].userName;
                        obj.email = dbData[0].email;
                        obj.fullName = dbData[0].fullName;
                        obj.facebookId = dbData[0].facebookId;
                        obj.googleId = dbData[0].googleId;
                        obj.forgotToken = dbData[0].forgotToken;
                        obj.forgotOTP = dbData[0].forgotOTP;
                        const token = jwt.sign({ id: dbData[0].userId }, 'WAKITECHUGO', {})
                        obj.token = token;
                        cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.USER_ADDED, "result": obj });
                    }

                });
            });
        }],

    }, (err, response) => {
        callback(response.createUserinDB);
    });
}

/*  Login API */
let login = (data, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {

            if (!data.email) {
                cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            let criteria = {
                email: data.email,
                password: util.encryptData(data.password)
            }
            console.log(criteria, "dhs")
            userDAO.getUsersLogin(criteria, (err, dbData) => {
                console.log(dbData, "fsdjfd")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
                }

                if (dbData && dbData.length) {

                    const token = jwt.sign({ id: dbData[0].userId }, 'WAKITECHUGO', {})
                    dbData[0].token = token
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.LOGIN_SUCCESS, "result": dbData[0] });
                } else {
                    cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.INCORRECT_CREDENTIALS });
                }
            });
        }
    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })
}

/** Facebook login API */
let loginWithFacebook = (data, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.facebookId || !data.email) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }

            let criteria = {
                email: data.email,
            }

            userDAO.getUsers(criteria, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SOMETHING_WENT_WRONG })
                    return;
                }
                if (dbData && dbData.length) {
                     let dataToSet = {
                          "facebookId": data.facebookId,
                      }
                     userDAO.updateUser(criteria,dataToSet, (err, dbData) => {
                        if (err) {
                            cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SOMETHING_WENT_WRONG })
                            return;
                        }
                        userDAO.getUsers(criteria, (err, dbData) => {
                            if (err) {
                                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SOMETHING_WENT_WRONG })
                                return;
                            }
                           const token = jwt.sign({ id: dbData[0].userId }, 'WAKITECHUGO', {})
                           dbData[0].token = token;
                           cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.REGISTRATION_DONE, "result": dbData[0], "user_status": "old" });
                           return;
                       })
                     })
                     
                }
                else{
                    let dataToSet = {
                        "googleId": data.googleId ? data.googleId : '0',
                        "facebookId": data.facebookId ,
                        "userName": data.userName ? data.userName : '',
                        "fullName": data.fullName ? data.fullName : '',
                        "email": data.email,
                        "forgotToken": data.forgotToken ? data.forgotToken : '0',
                        "forgotOTP": data.forgotOTP ? data.forgotOTP : '0',
                    }

                    userDAO.createUser(dataToSet, (err, dbData) => {
                        if (err) {
                            cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SOMETHING_WENT_WRONG });
                            return;
                        }
                        else{
                            userDAO.getUsers(criteria, (err, dbData) => {
                                if (err) {
                                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SOMETHING_WENT_WRONG })
                                    return;
                                }
                                dataToSet = {
                                    "userId": dbData[0].userId
                                }
                                userDAO.createUserInfo(dataToSet, (err, dbData) => {
                                    cb(null)
                                });
                               const token = jwt.sign({ id: dbData[0].userId }, 'WAKITECHUGO', {})
                               dbData[0].token = token;
                               cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.REGISTRATION_DONE, "result": dbData[0], "user_status": "new" });
                               return;
                           })
                        }
                    });
                }

            });
        }
    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })
}

/** Google login API */
let loginWithGoogle = (data, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.googleId || !data.email) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }

            let criteria = {
                email: data.email,
            }

            userDAO.getUsers(criteria, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SOMETHING_WENT_WRONG })
                    return;
                }
                if (dbData && dbData.length) {
                     let dataToSet = {
                          "googleId": data.googleId,
                      }
                     userDAO.updateUser(criteria,dataToSet, (err, dbData) => {
                        if (err) {
                            cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SOMETHING_WENT_WRONG })
                            return;
                        }
                        userDAO.getUsers(criteria, (err, dbData) => {
                            if (err) {
                                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SOMETHING_WENT_WRONG })
                                return;
                            }
                           const token = jwt.sign({ id: dbData[0].userId }, 'WAKITECHUGO', {})
                           dbData[0].token = token;
                           cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.REGISTRATION_DONE, "result": dbData[0], "user_status": "old" });
                           return;
                       })
                     })
                     
                }
                else{
                    let dataToSet = {
                        "googleId": data.googleId,
                        "facebookId": data.facebookId ? data.facebookId : '0',
                        "userName": data.userName ? data.userName : '',
                        "fullName": data.fullName ? data.fullName : '',
                        "email": data.email,
                        "forgotToken": data.forgotToken ? data.forgotToken : '0',
                        "forgotOTP": data.forgotOTP ? data.forgotOTP : '0',
                    }

                    userDAO.createUser(dataToSet, (err, dbData) => {
                        if (err) {
                            cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SOMETHING_WENT_WRONG });
                            return;
                        }
                        else{
                            
                            userDAO.getUsers(criteria, (err, dbData) => {
                                if (err) {
                                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SOMETHING_WENT_WRONG })
                                    return;
                                }
                                dataToSet = {
                                    "userId": dbData[0].userId
                                }
                                userDAO.createUserInfo(dataToSet, (err, dbData) => {
                                    cb(null)
                                });
                               const token = jwt.sign({ id: dbData[0].userId }, 'WAKITECHUGO', {})
                               dbData[0].token = token;
                               cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.REGISTRATION_DONE, "result": dbData[0], "user_status": "new" });
                               return;
                           })
                        }
                    });
                }

            });
        }
    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })
}

/** Forgot Password API */
let forgotPassword = (data, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            console.log(data.email)
            if (!data.email) {
                cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            let criteria = {
                email: data.email
            }

            userDAO.getUsers(criteria, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
                }

                if (dbData && dbData.length) {
                    let forgotToken = util.generateToken();
                    let criteria = {
                        email: data.email
                    }
                    let OTP = Math.floor(100000 + Math.random() * 900000);

                    let dataToSet = {
                        "forgotToken": forgotToken,
                        "forgotOTP": OTP
                    }
                    userDAO.updateUser(criteria, dataToSet, {}, (err, dbData) => {
                        if (err) {
                            cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                            return;
                        }
                    })
                    // code to send email...
                    util.sendEmail({ "email": data.email, "forgotToken": forgotToken, "OTP": OTP });
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.EMAIL_SENT });
                } else {
                    cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.INCORRECT_EMAIL });
                }
            });
        }
    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })
}

/** Verify forgot password API */
let verifyForgotPasswordLink = (data, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.email) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_FOUR, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            let criteria = {
                email: data.email,
                forgotOTP: data.forgotOTP
            }

            userDAO.getUsers(criteria, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                if (dbData && dbData.length) {
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.OTP_VERIFY_SUCCESS });
                } else {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_FOUR, "statusMessage": util.statusMessage.INVALID_OTP });
                }
            });
        },
    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })


}

/** change password API */
let updateForgotPassword = (data, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.email || !data.password || !data.otp) {
                cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            let criteria = {
                email: data.email,
                forgotOTP: data.otp
            }

            userDAO.getUsers(criteria, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                if (dbData && dbData.length && (dbData[0].forgotOTP != '0')) {
                    cb(null);
                } else {
                    cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": "Incorrect email or otp" });
                }
            });

            // code to validate token.....
        },
        updateStatusinDB: ['checkUserExistsinDB', (cb, functionData) => {
            if (functionData && functionData.checkUserExistsinDB) {
                cb(null, functionData.checkUserExistsinDB);
                return;
            }
            let criteria = {
                email: data.email
            }
            let dataToSet = {
                "password": util.encryptData(data.password),
                "forgotOTP": "0",
            }
            userDAO.updateUser(criteria, dataToSet, {}, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
            })
            cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.PASSWORD_UPDATED });
            return;
        }]
    }, (err, response) => {
        callback(response.updateStatusinDB);
    })


}

/*** change password API */
let changePassword = (data,headers, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.userId, !data.oldPassword) {
                cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

            })
            let criteria = {
                userId: userId,
                password: util.encryptData(data.oldPassword)
            }
            console.log(criteria,"uuuu")

            userDAO.getUserPassword(criteria, (err, dbData) => {
                console.log(criteria,"ppp")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                if (dbData && dbData.length) {
                    cb(null);
                    return;
                } else {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_FOUR, "statusMessage": util.statusMessage.INCORRECT_PASSWORD });
                    return;
                }
            });
        },
        updatePasswordInDB: ['checkUserExistsinDB', (cb, functionData) => {
            if (functionData && functionData.checkUserExistsinDB && functionData.checkUserExistsinDB.statusCode) {
                cb(null, functionData.checkUserExistsinDB);
                return;
            }
            var userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

            })
            let criteria = {
                userId: userId,
            }
            let dataToSet = {
                "password": util.encryptData(data.newPassword),
            }
            userDAO.updateUserPassword(criteria, dataToSet, {}, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.FOUR_ZERO_ONE, "statusMessage": util.statusMessage.SOMETHING_WENT_WRONG })
                    return;
                }

            });
            cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.PASSWORD_CHANGED })

        }]
    }, (err, response) => {
        callback(response.updatePasswordInDB);
    });

}

/** update facebook API */
let updateFacebook = (data, headers, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.userName) {
                cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            let userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

            })
            let criteria = {
                "userId": userId,
            }
            userDAO.getUsers(criteria, (err, dbData) => {
                //console.log(err, "oooo")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                } if (dbData && dbData.length) {
                    let criteria = {
                        userName: data.userName
                    }
                    userDAO.getUsers(criteria, (err, dbData2) => {
                        if (dbData2 && dbData2.length > 0) {
                            cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.USERNAME });
                            return;
                        }
                        else {
                            cb(null);
                        }
                    })
                } else {
                    cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": "Please enter correct facebook Id." });
                }

            })
        },
        updateUserNameinDB: ['checkUserExistsinDB', (cb, functionData) => {
            if (functionData && functionData.checkUserExistsinDB) {
                cb(null, functionData.checkUserExistsinDB);
                return;
            }
            let userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

            })
            let criteria = {
                "userId": userId,
            }
            let dataToSet = {
                "userName": data.userName
            }
            userDAO.updateUser(criteria, dataToSet, {}, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
            })
            cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.USERNAME_UPDATED });

        }]
    }, (err, response) => {
        callback(response.updateUserNameinDB);
    })


}

/**Update google API */
let updateGoogle = (data, headers, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.userName) {
                cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

            })
            let criteria = {
                "userId": userId,
            }

            userDAO.getUsers(criteria, (err, dbData) => {
                console.log(dbData, "dsdds")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                if (dbData && dbData.length) {
                    let criteria = {
                        userName: data.userName
                    }
                    userDAO.getUsers(criteria, (err, dbData2) => {
                        if (dbData2 && dbData2.length > 0) {
                            cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.USERNAME });
                            return;
                        }
                        else {
                            cb(null);
                        }
                    })
                } else {
                    cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": "Please enter correct google Id." });
                }


            });
        },
        updateUserNameinDB: ['checkUserExistsinDB', (cb, functionData) => {
            if (functionData && functionData.checkUserExistsinDB) {
                cb(null, functionData.checkUserExistsinDB);
                return;
            }
            var userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

            })
            let criteria = {
                "userId": userId,
            }

            let dataToSet = {
                "userName": data.userName
            }
            userDAO.updateUser(criteria, dataToSet, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
            })
            cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.USERNAME_UPDATED });

        }]
    }, (err, response) => {
        callback(response.updateUserNameinDB);
    })


}

/**Profile update API */
let profileUpdate = (data, files, headers, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
           //console.log(data)
            var userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

            })
            var criteria = {
                userId: userId
            }
            userDAO.getUserInfo(criteria, (err, dbData) => {
                //console.log(err,dbData)
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                } 
                cb(null)
                return 
            });
        },
        updateUserNameinDB: ['checkUserExistsinDB', (cb, functionData) => {
            if (functionData && functionData.checkUserExistsinDB) {
                cb(null, functionData.checkUserExistsinDB);
                return;
            }
            var userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

            })
            let criteria = {
                userId: userId,
            }
            let userImage;
            //console.log(files)
            if (files && files.userImage && files.userImage[0].filename && files.userImage[0].size > 0) {
                userImage = files.userImage[0].filename;
            }
            let dataToSet = {}
            if(data.bio)
                dataToSet.bio = data.bio
            if(data.location)
                dataToSet.location = data.location
            if(data.website)
                dataToSet.website = data.website
            if(data.birthDate)
                dataToSet.birthDate = data.birthDate
            
            if (userImage && userImage != " ") {
                dataToSet.userImage = userImage
            }

            //console.log("           BEFORE updateUserInfo",dataToSet)
            if(Object.keys(dataToSet).length != 0){
                userDAO.updateUserInfo(criteria, dataToSet, {}, (err, dbData) => {
                   // console.log("           IN updateUserInfo")
                    if (err) {
                        cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                        return;
                    }
                })
            }
            
            let dataToSet2 = {}
            if(data.fullName){
                dataToSet2.fullName = data.fullName
            }
            //console.log("           BEFORE updateUser")
            if(Object.keys(dataToSet2).length != 0){
                //console.log("           IN updateUser")
                userDAO.updateUser(criteria, dataToSet2, (err, dbData) => {
                    if (err) {
                        cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                        return;
                    }
                })
            }
           // console.log("           BEFORE getUserProfile")
            userDAO.getUserProfile(criteria, (err, dbData) => {
                //console.log("           IN getUserProfile")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.PROFILE_UPDATE, "result": dbData[0] });
                return;
            })
        }]
    }, (err, response) => {
        callback(response.updateUserNameinDB);
    })
}

/**Create Post API */
let createPost = (data, files, headers, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            // if (!data.userId) {
            //     cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.PARAMS_MISSING })
            //     return;
            // }

            var userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

            })
            var criteria = {
                userId: userId
            }
            userDAO.getUsers(criteria, (err, dbData) => {

                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                } else {
                    cb(null);

                }
            });
        },
        updateUserNameinDB: ['checkUserExistsinDB', (cb, functionData) => {
            if (functionData && functionData.checkUserExistsinDB) {
                cb(null, functionData.checkUserExistsinDB);
                return;
            }
            var userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

            })
            let postImage;

            if (files && files.postImage && files.postImage[0].filename && files.postImage[0].size > 0) {
                postImage = files.postImage[0].filename;
            }
            let dataToSet = {
                "userId": userId,
                "text": data.text ? data.text : '',
                "repostId": data.repostId ? data.repostId : '0',
                "hashTag": data.hashTag ? data.hashTag : '',
                //"postImage": files.postImage[0].filename,
                "parentId": data.parentId ? data.parentId : '0'
            }
            if (postImage && postImage != "") {
                dataToSet.postImage = postImage
            }
            userDAO.createPost(dataToSet, (err, dbData) => {
                //console.log(err, "")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
            })
            cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.POST_CREATE });

        }]
    }, (err, response) => {
        callback(response.updateUserNameinDB);
    })

}

/** search user by like key */
let searchByUserName = (data, headers, callback) => {
    //console.log(data, "fdufh")
    async.auto({
        checkUserNameExistsinDB: (cb) => {
            if (!data.userName) {
                cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            
            let criteria = {
                "userName": data.userName,
            }

            userDAO.getUserByUserName(criteria, (err, dbData) => {
            //    console.log(err, "Ambuj")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                else {
                    cb(null, { "statusCode": util.statusCode.OK, "result": dbData });
                }
            });
        },
    }, (err, response) => {
        callback(response.checkUserNameExistsinDB);
    })


}

/** search by hash tag post */
let searchByHashTag = (data, headers, callback) => {
    async.auto({
        checkHashTagExistsinDB: (cb) => {
            if (!data.hashTag) {
                cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            
            let criteria = {
                "hashTag": data.hashTag,
            }

            userDAO.getUserPost(criteria, async (err, dbData) => {
               await addFields(dbData)
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                else {
                    cb(null, { "statusCode": util.statusCode.OK, "result": dbData });
                    return;
                }
            });
        },
    }, (err, response) => {
        callback(response.checkHashTagExistsinDB);
    })


}

/** search user by like key */
let getUser = (data, headers, callback) => {
    async.auto({
        checkUserNameExistsinDB: (cb) => {
            var userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

            })
            let criteria = {
                "userId": userId,
            }

            userDAO.getUser(criteria, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                else {
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.FETCHED_SUCCESSFULLY, "result": dbData[0] });
                }
            });
        },
    }, (err, response) => {
        callback(response.checkUserNameExistsinDB);
    })


}

/** feed post of all user */
let feedPost = (data, headers, callback) => {
    async.auto({
        checkUserNameExistsinDB: (cb) => {
            var userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

            })
            
            let criteria = {
                userId: userId,
            }
            if(data.search){
                criteria.searchPost = data.search
            }
            console.log(criteria)
            userDAO.getUserPost(criteria, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                else {
                    dbData.sort(function(a,b){
                        return new Date(b.createdOn) - new Date(a.createdOn);
                      });
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.POST, "result": dbData });
                }
            });
        },
    }, (err, response) => {
        callback(response.checkUserNameExistsinDB);
    })

}

/** post Replies of all user */
let postReplies = (data, headers, callback) => {
    async.auto({
        checkUserNameExistsinDB: (cb) => {
            if (!data.postId ) {
                cb(null, {
                    "statusCode": util.statusCode.BAD_REQUEST,
                    "statusMessage": util.statusMessage.PARAMS_MISSING
                })
                return;
            }
            var userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

            })
            let criteria = {
               // userId: userId,
                parentId:data.postId
            }
            userDAO.getPostReplies(criteria, (err, dbData) => {
                //console.log(err, "Ambuj")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                else {

                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "All user post replies fetched successfully", "result": dbData });
                }
            });
        },
    }, (err, response) => {
        callback(response.checkUserNameExistsinDB);
    })

}

/** single post of  user */
let singlePost = (data, headers, callback) => {
    async.auto({
        checkUserNameExistsinDB: (cb) => {
            var userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

            })
            let criteria = {
                "userId": userId,
            }

            userDAO.getPost(criteria, (err, dbData) => {
                // console.log(dbData, "Ambuj")
                // console.log(criteria, "user")
                // console.log(err, "ffffff")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                else {

                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.POST, "result": dbData });
                }
            });
        },
    }, (err, response) => {
        callback(response.checkUserNameExistsinDB);
    })

}

/**get user info */
let getUsers = (criteria, cb) => {
    userDAO.getUser(criteria, (err, dbSubData) => {
        if (err) {
            cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
        }
        cb(null, dbSubData);
    })
}

/**get follower */
let getFollower = (criteria, cb) => {
    userDAO.getFollower(criteria, (err, dbSubData) => {
        if (err) {
            cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
        }
        cb(null, dbSubData);
    })
}

/** get followed*/
let getFollowed = (criteria, cb) => {
    userDAO.getFollowed(criteria, (err, dbSubData) => {
        if (err) {
            cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
        }
        cb(null, dbSubData);
    })
}

/* get user profile */
let getProfile = (data, headers, callback) => {
    async.parallel({
        profile: (cb) => {
            var userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

            })
            var criteria = {
                userId: userId
            }
            getUsers(criteria, (err, response) => {
                console.log(response, "asasas")
                cb(null, response);
            });
        },
        follower: (cb) => {
            var userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

            })
            var criteria = {
                followerId: userId
            }
            getFollower(criteria, (err, response) => {

                cb(null, response[0]);
            });
        },
        followed: (cb) => {
            var userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

            })
            var criteria = {
                followedId: userId
            }
            getFollowed(criteria, (err, response) => {
                console.log(response, "wwww")
                cb(null, response[0]);
            });
        },


    }, (err, response) => {
        let res1 = {};
        // let data2 = {}
        // data2.follower = response.follower;

        // let data3 = {}
        // data3.data = response.followed;
        // var res2 = []
        // res2.push(data2)
        // res2.push(data3)
        res1.follower = response[0];
        res1.followed = response;
        res1 = response;


        //res1 = res2;
        callback({ "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.POST, "result": res1 });
    }),
        (err) => {
            callback(err);
        }
}

let getlike = (data, callback) => {
    async.auto({
        checkUserNameExistsinDB: (cb) => {

            let criteria = {
                "postId": data.postId,
                "userId": data.userId,
            }

            userDAO.getLike(criteria, (err, dbData) => {
                console.log(err, "Ambuj")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                else {
                    cb(null, { "statusCode": util.statusCode.OK, "result": dbData });
                }
            });
        },
    }, (err, response) => {
        callback(response.checkUserNameExistsinDB);
    })


}

/**get follower */
let getFollowers = (criteria, cb) => {
    userDAO.getAddFollower(criteria, (err, dbSubData) => {
        if (err) {
            cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
        }
        cb(null, dbSubData);
    })
}

/** Add Follower */
let follower = (data, headers, callback) => {
    async.auto({
        checkfollowIdinDB: (cb) => {
            var followerId
         
            util.jwtDecode(headers.accesstoken, (err, token) => {
                followerId = token

            })
           
            let criteria = {
                "followerId": followerId,
                "followedId": data.userId,
            }
            console.log(criteria)
            // let criteria = {
            //     "followerId": data.followerId,
            //     "followedId": data.followedId,
            // }
            userDAO.getfollowId(criteria, (err, dbData) => {
                console.log(err, "yty");
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                if (dbData.length != 0) {
                    cb(null, { "statusCode": util.statusCode.OK, "result": dbData[0] });
                }
                else {
                    let dataToSet = {
                        "followerId": followerId ? followerId : '0',
                        "followedId": data.userId ? data.userId : '0',
                        "followStatus": "true",
                    }
                    userDAO.addFollower(dataToSet, (err, dbData) => {
                        console.log(err, "ytfady");
                        if (err) {
                            cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                            return;
                        }
                        async.parallel({
                            follower: (cb) => {
                                var criteria = {
                                    userId: dataToSet.followerId
                                }
                                getFollowers(criteria, (err, response) => {

                                    cb(null, response[0]);
                                });
                            },
                            followed: (cb) => {
                                var criteria = {
                                    userId: dataToSet.followedId
                                }
                                getFollowers(criteria, (err, response) => {
                                    console.log(response, "wwww")
                                    cb(null, response[0]);
                                });
                            },


                        }, (err, response) => {

                            callback({ "statusCode": util.statusCode.OK, "statusMessage": response.follower.fullName + " " + "follow" + " " + response.followed.fullName });
                        }),
                            (err) => {
                                callback(err);
                            }
                    });
                }

            });
        },
    }, (err, response) => {
        callback(response.checkfollowIdinDB);
    })
}

/* Get Profile */
let profile = (data, headers, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.userId) {
                cb(null, {
                    "statusCode": util.statusCode.BAD_REQUEST,
                    "statusMessage": util.statusMessage.PARAMS_MISSING
                })
                return;
            }
            
            let criteria = {
                "userId": data.userId,
            }
            //console.log(data);
            userDAO.getProfile(criteria, (err, dbData) => {
                //console.log(err)
               // console.log(err,dbData)
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                if(dbData && dbData.length == 0){
                    cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": "User not found." });
                }
                else {
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.FETCHED_SUCCESSFULLY, "result": dbData[0] });
                }
            });
        },
    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })


}

/* Like Post */
let like = (data, headers, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.postId) {
                cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

            })
            let criteria = {
                "userId": userId,
                "postId": data.postId,
            }
            userDAO.getLike(criteria, (err, dbData) => {
                if (err) {
                    console.log(dbData, err);
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;

                }
                if (dbData && dbData.length) {
                    userDAO.updateLikePost(criteria, { likeStatus: dbData[0].likeStatus},(err2, dbData2) => {
                        if(dbData[0].likeStatus == 'true'){
                            msg = "You remove like from this post"
                        }else{
                            msg = "You liked this post"
                        }
                        cb(null, { "statusCode": util.statusCode.OK, "statusMessage": msg })
                        return;
                    })

                    
                } else {
                    console.log(dbData, "sda");
                    cb(null);

                }
            });
        },
        updateUserNameinDB: ['checkUserExistsinDB', (cb, functionData) => {
            if (functionData && functionData.checkUserExistsinDB) {
                cb(null, functionData.checkUserExistsinDB);
                return;
            }
            var userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

            })
            let dataToSet = {
                "postId": data.postId,
                "userId": userId
            }
            console.log(data);
            userDAO.likePost(dataToSet, (err, dbData) => {
                console.log(dbData, "wwww")
                if (err) {
                    console.log(err);
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                else {
                    console.log(dbData);
                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.LIKE_POST });
                }
            });
        }]
    }, (err, response) => {
        callback(response.updateUserNameinDB);
    })

}

/**Update Device Token */
let updateDevicetoken = (data, headers, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            //console.log(data)
            if ((data.deviceType == undefined) || (data.userDeviceToken == undefined) || !data.deviceId) {
                cb(null, {
                    "statusCode": util.statusCode.BAD_REQUEST,
                    "statusMessage": util.statusMessage.PARAMS_MISSING
                })
                return;
            }
            var userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

            })
            var criteria = {
                userId: userId
            }
            userDAO.getUsers(criteria, (err, dbData) => {
                //console.log(err,dbData)
                if (err) {
                    cb(null, {
                        "statusCode": util.statusCode.INTERNAL_SERVER_ERROR,
                        "statusMessage": util.statusMessage.DB_ERROR
                    });
                    return;
                }
                if (dbData && dbData.length == 0) {
                    cb(null, {
                        "statusCode": util.statusCode.FOUR_ZERO_ONE,
                        "statusMessage": util.statusMessage.USER_NOT_FOUND
                    });
                    return;
                }

                cb(null);
            });
        },
        updateStatusinDB: ['checkUserExistsinDB', (cb, functionData) => {
            if (functionData && functionData.checkUserExistsinDB) {
                cb(null, functionData.checkUserExistsinDB);
                return;
            }
            var userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

            })
            var criteria = {
                userId: userId,
                deviceId:data.deviceId
            }
            var dataToSet = {
                "userId": userId,
                "deviceId":data.deviceId,
                "deviceType": data.deviceType,
                "userDeviceToken": data.userDeviceToken

            }
            //console.log(dataToSet)
            userDAO.updateUserDevicetoken(criteria, dataToSet, (err, dbData) => {
                //console.log(err,dbData)
                if (err) {
                    cb(null, {
                        "statusCode": util.statusCode.INTERNAL_SERVER_ERROR,
                        "statusMessage": util.statusMessage.DB_ERROR
                    });

                }
                cb(null, {
                    "statusCode": util.statusCode.OK,
                    "statusMessage": util.statusMessage.DEVICE_TOKEN_UPDATE
                });


            })
        }]
    }, (err, response) => {
        callback(response.updateStatusinDB);
    })

}

/**send notification */
let notification = (data, headers, callback) => {
    async.auto({
        addNotificationinDB: (cb) => {
            if (!data.receivingUserId || !data.triggeringUserId || !data.type) {
                cb(null, {
                    "statusCode": util.statusCode.BAD_REQUEST,
                    "statusMessage": util.statusMessage.PARAMS_MISSING
                })
                return;
            }
            let dataToSet = {
                "receivingUserId" : data.receivingUserId,
                "triggeringUserId" :data.triggeringUserId,
                "message" : "",
                "type" : data.type,
                "seen" : "false",
            }
           // console.log(data)
            if(data.type=='2' || data.type=='3' || data.type=='5' || data.type=='6'){
                //console.log("asdf")
                if (!data.postId) {
                    cb(null, {
                        "statusCode": util.statusCode.BAD_REQUEST,
                        "statusMessage": util.statusMessage.PARAMS_MISSING
                    })
                    return;
                }else{
                    dataToSet.postId = data.postId
                }
            }
            var userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token
        
            })
            var criteria = {
                userId: userId
            }
        
            userDAO.notification(criteria, dataToSet, (err, dbData) => {
                console.log("AA",err,dbData)
                if (err) {
                    cb(null, {
                        "statusCode": util.statusCode.INTERNAL_SERVER_ERROR,
                        "statusMessage": util.statusMessage.DB_ERROR
                    })
                    return;
                }
                
                userDAO.getUserDeviceToken(criteria, (err, subdbData) => {
                   
                    let usertoken = subdbData.map(a => a.userDeviceToken);
                    console.log("Token",usertoken)
                    if (err) {
                        cb(null, {
                            "statusCode": util.statusCode.INTERNAL_SERVER_ERROR,
                            "statusMessage": util.statusMessage.DB_ERROR
                        })
                        return;
                    }
                     deviceToken = "dgh "//data[0].deviceToken;
                    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                        to: deviceToken,

                        notification: {
                            title: 'Social App ',
                            body: 'Ankit Kumar'
                        },

                        data: {  //you can send only notification or only data(or include both)
                            my_key: 'my value',
                            my_another_key: 'my another value'
                        }
                    };

                    fcm.send(message, function (err, response) {
                        if (err) {
                            console.log("Something has gone wrong!");
                            console.log(err)
                            cb(null, {
                                "statusCode": util.statusCode.BAD_REQUEST,
                                "statusMessage": err
                            })
                            return;
                            callback(null, err)
                        } else {
                            console.log("Successfully sent with response: ", response);
                            //console.log(response);
                            cb(null, {
                                "statusCode": util.statusCode.OK,
                                "statusMessage": response
                            })
                            return;
                            
                        }
                    });
                                
                })

                
            }) 
        }, 
              
    }, (err, response) => {
       // console.log(response)
        callback(response.addNotificationinDB);
    })

    // 
}

let notificationList = (query, headers, callback) => {
    async.auto({
        checkUserNameExistsinDB: (cb) => {
            var userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

            })
            let criteria = {
                //triggeringUserId:userId,
                receivingUserId:userId
            }
            userDAO.notificationList(criteria, (err, dbData) => {
                
                if (err) {
                    cb(null, {
                        "statusCode": util.statusCode.INTERNAL_SERVER_ERROR,
                        "statusMessage": util.statusMessage.DB_ERROR
                    });
                    return;
                } else if( dbData && dbData.length){
                    cb(null, {
                        "statusCode": util.statusCode.OK,
                        "statusMessage": "Notification list fetch successfully.",
                        "result": dbData
                    });
                }
                else{
                    cb(null, {
                        "statusCode": util.statusCode.OK,
                        "statusMessage": "No result found.",
                        
                    });
                }
            });
        },
    }, (err, response) => {
        callback(response.checkUserNameExistsinDB);
    })

}

let markNotification = (data, headers, callback) => {
    async.auto({
        checkUserNameExistsinDB: (cb) => {
            if (!data.notificationId) {
                cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

            })
            let criteria = {
                //triggeringUserId:userId,
                receivingUserId:userId,
                notificationId:data.notificationId
            }

                userDAO.updateNotification(criteria, {seen:'true'} ,(err2, dbData2) => {
                    //console.log("LIST ",err2,dbData2)
                    
                    if (err2) {
                        cb(null, {
                            "statusCode": util.statusCode.INTERNAL_SERVER_ERROR,
                            "statusMessage": util.statusMessage.DB_ERROR
                        });
                        return;
                    } else {

                        cb(null, {
                            "statusCode": util.statusCode.OK,
                            "statusMessage": "Notification seen.",
                            
                        });
                    }
                });
            
        },
    }, (err, response) => {
        callback(response.checkUserNameExistsinDB);
    })

}

let notificationsPreferences = (data, headers, callback) => {
    async.auto({
        checkUserNameExistsinDB: (cb) => {
            if (!data.notificationType || !data.status) {
                cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

            })
            let criteria = {
                userId:userId,
                notificationType:data.notificationType
            }
            let dataToSet = {
                userId:userId,
                notificationType:data.notificationType,
                status:data.status
            }
            
            userDAO.getNotificationsPreferences(criteria, (err, dbData) => {
                console.log("1679",err,dbData)
                if (err) {
                    cb(null, {
                        "statusCode": util.statusCode.INTERNAL_SERVER_ERROR,
                        "statusMessage": util.statusMessage.DB_ERROR
                    });
                    return;
                }

                if(dbData && dbData.length==0){
                    userDAO.addNotificationsPreferences(dataToSet, (err2, dbData2) => {
                        console.log("1690",err,dbData)
                        if (err2) {
                            cb(null, {
                                "statusCode": util.statusCode.INTERNAL_SERVER_ERROR,
                                "statusMessage": util.statusMessage.DB_ERROR
                            });
                            return;
                        }
                        cb(null, {
                            "statusCode": util.statusCode.BAD_REQUEST,
                            "statusMessage": "Notifications Preferences updated"
                        });
                        return;
                    })
                    
                }else{
                    userDAO.updateNotificationsPreferences(criteria, dataToSet ,(err2, dbData2) => {
                        console.log("1707",err,dbData)
                        if (err2) {
                            cb(null, {
                                "statusCode": util.statusCode.INTERNAL_SERVER_ERROR,
                                "statusMessage": util.statusMessage.DB_ERROR
                            });
                            return;
                        } else {
    
                            cb(null, {
                                "statusCode": util.statusCode.OK,
                                "statusMessage": "Notifications Preferences updated",
                                
                            });
                        }
                    });
                }
                
            })
        },
    }, (err, response) => {
        callback(response.checkUserNameExistsinDB);
    })

}

let getFeedCoin = (query, headers, callback) => {
    async.auto({
        checkUserNameExistsinDB: (cb) => {
            var userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

            })
            let criteria = {
                //userId: userId,
                coinFeed: query.search
            }
            userDAO.getUserFeedCoin(criteria, (err, dbData) => {
                //console.log(err)
                if (err) {
                    cb(null, {
                        "statusCode": util.statusCode.INTERNAL_SERVER_ERROR,
                        "statusMessage": util.statusMessage.DB_ERROR
                    });
                    return;
                } else {

                    cb(null, {
                        "statusCode": util.statusCode.OK,
                        "statusMessage": util.statusMessage.FEED_COIN,
                        "result": dbData
                    });
                }
            });
        },
    }, (err, response) => {
        callback(response.checkUserNameExistsinDB);
    })

}

/** Subscribe */
let subscribe = (data,headers, callback) => {
    let userId
    util.jwtDecode(headers.accesstoken, (err, token) => {
        userId = token

    })
    async.auto({
        checkSubscribeIdinDB: (cb) => {

            if (!data.userId ) {
                cb(null, {
                    "statusCode": util.statusCode.BAD_REQUEST,
                    "statusMessage": util.statusMessage.PARAMS_MISSING
                })
                return;
            }
            

            let criteria = {
                "subscribingUserId": userId,
                "subscribedUserId": data.userId,
                "subscriptionStatus": "true",
            }
            console.log(criteria)
            userDAO.subscribe(criteria, (err, dbData) => {
                console.log(err, dbData)
                if (err) {
                    cb(null, {
                        "statusCode": util.statusCode.BAD_REQUEST,
                        "statusMessage": util.statusMessage.INVALID_USER_ID
                    });
                    return;
                }

                if (dbData.length == 0) {
                    console.log("subscribed  User Id not found");
                    cb(null, {
                        "statusCode": util.statusCode.BAD_REQUEST,
                        "statusMessage": util.statusMessage.INVALID_USER_ID
                    });
                    return;
                }

                userDAO.getSubscription(criteria, (err, dbData) => {
                    console.log(err, dbData)
                    if (err) {
                        cb(null, {
                            "statusCode": util.statusCode.INTERNAL_SERVER_ERROR,
                            "statusMessage": util.statusMessage.DB_ERROR
                        });
                        return;
                    }
                    if (dbData && dbData.length != 0 && dbData[0].subscriptionStatus == 'false') {
                        let criteria = {
                            "subscriptionId": dbData[0].subscriptionId
                        }
                        let dataToSet = {
                            "subscriptionStatus": "true"
                        }
                        userDAO.updateSubscription(criteria, dataToSet, (err, updatedbData) => {
                            //console.log(err, dbData);
                            if (err) {
                                cb(null, {
                                    "statusCode": util.statusCode.INTERNAL_SERVER_ERROR,
                                    "statusMessage": util.statusMessage.DB_ERROR
                                });
                                return;
                            }

                            if (updatedbData.length != 0) {

                                async.parallel({
                                    subscribingUser: (cb) => {
                                        var criteria = {
                                            userId: userId
                                        }
                                        getFollowers(criteria, (err, response) => {

                                            cb(null, response[0]);
                                        });
                                    },
                                    subscribedUser: (cb) => {
                                        var criteria = {
                                            userId: data.userId
                                        }
                                        getFollowers(criteria, (err, response) => {
                                            cb(null, response[0]);
                                        });
                                    },


                                }, (err, response) => {

                                    callback({
                                        "statusCode": util.statusCode.OK,
                                        "statusMessage": response.subscribingUser.fullName + " " + " subscribe" + " " + response.subscribedUser.fullName
                                    });
                                })


                            }

                        });

                    } else if (dbData && dbData.length != 0 && dbData[0].subscriptionStatus == 'true') {
                        console.log(dbData)
                        cb(dbData, {
                            "statusCode": util.statusCode.BAD_REQUEST,
                            "statusMessage": util.statusMessage.ALREADY_SUBSCRIBE
                        })
                        return;
                    }
                    else if (dbData && dbData.length == 0) {
                        console.log("dbData")
                        cb(null)
                    }
                });
            });
        },

        addSubscribeIdinDB: ['checkSubscribeIdinDB', (cb, functionData) => {
            if (functionData && functionData.checkUserExistsinDB) {
                cb(null, functionData.checkUserExistsinDB);
                return;
            }

            let dataToSet = {
                "subscribingUserId": userId ,
                "subscribedUserId": data.userId ,
                "subscriptionStatus": "true",
            }

            userDAO.addSubscribe(dataToSet, (err, dbData) => {
                if (err) {
                    cb(null, {
                        "statusCode": util.statusCode.INTERNAL_SERVER_ERROR,
                        "statusMessage": util.statusMessage.DB_ERROR
                    });
                    return;
                }
                async.parallel({
                    subscribingUser: (cb) => {
                        var criteria = {
                            userId: data.userId
                        }
                        getFollowers(criteria, (err, response) => {

                            cb(null, response[0]);
                        });
                    },
                    subscribedUser: (cb) => {
                        var criteria = {
                            userId: data.userId
                        }
                        getFollowers(criteria, (err, response) => {
                            cb(null, response[0]);
                        });
                    },


                }, (err, response) => {

                    callback({
                        "statusCode": util.statusCode.OK,
                        "statusMessage": response.subscribingUser.fullName + " " + " subscribe" + " " + response.subscribedUser.fullName
                    });
                }),
                    (err) => {
                        callback(err);
                    }
            });
        }]
    }, (err, response) => {
        callback(response.checkSubscribeIdinDB);
    })
}

/** unsubscribe */
let unsubscribe = (data, headers, callback) => {
    let userId
    util.jwtDecode(headers.accesstoken, (err, token) => {
        userId = token

    })
    async.auto({
        checkSubscribeIdinDB: (cb) => {
            if (!data.userId ) {
                cb(null, {
                    "statusCode": util.statusCode.BAD_REQUEST,
                    "statusMessage": util.statusMessage.PARAMS_MISSING
                })
                return;
            }
           
            let criteria = {
                "subscribingUserId": userId,
                "subscribedUserId":data.userId
            }
            userDAO.subscribe(criteria, (err, dbData) => {
                //console.log(err, dbData)
                if (err) {
                    cb(null, {
                        "statusCode": util.statusCode.BAD_REQUEST,
                        "statusMessage": util.statusMessage.INVALID_USER_ID
                    });
                    return;
                }

                if (dbData.length == 0) {
                    console.log("subscribed  User Id not found");
                    cb(null, {
                        "statusCode": util.statusCode.BAD_REQUEST,
                        "statusMessage": util.statusMessage.INVALID_USER_ID
                    });
                    return;
                }
                userDAO.getSubscription(criteria, (err, dbData) => {
                    //console.log("Ankit ",err, dbData)
                    if (err) {
                        cb(null, {
                            "statusCode": util.statusCode.BAD_REQUEST,
                            "statusMessage": util.statusMessage.DB_ERROR
                        });
                        return;
                    }
                    if (dbData && dbData.length != 0 && dbData[0].subscriptionStatus == 'false'){
                        //console.log(dbData)
                        cb(null, {
                            "statusCode": util.statusCode.BAD_REQUEST,
                            "statusMessage": util.statusMessage.ALREADY_UNSUBSCRIBE
                        })
                        return;
                    }
                    else if (dbData && dbData.length == 0 ){
                        cb(null, {
                            "statusCode": util.statusCode.BAD_REQUEST,
                            "statusMessage": util.statusMessage.SUBSCRIPTION_NOT_FOUND
                        })
                        return;
                    }
                    else{
                        cb(null)
                    }
                    
                });
                
            })
            
        },
        updateSubscribeinDB: ['checkSubscribeIdinDB', (cb, functionData) => {
            console.log(cb, functionData)
            if (functionData && functionData.checkSubscribeIdinDB) {
                cb(null, functionData.checkSubscribeIdinDB);
                return;
            }

            let criteria = {
                "subscribingUserId": userId,
                "subscribedUserId":data.userId
            }
            let dataToSet = {
                "subscriptionStatus" : "false"
            }
            userDAO.updateSubscription(criteria,dataToSet, (err, dbData) => {
                //console.log(err, dbData);
                if (err) {
                    cb(null, {
                        "statusCode": util.statusCode.INTERNAL_SERVER_ERROR,
                        "statusMessage": util.statusMessage.DB_ERROR
                    });
                    return;
                }

                if (dbData.length != 0) {
                    cb(null, {
                        "statusCode": util.statusCode.OK,
                        "result": util.statusMessage.UNSUBSCRIBE
                    });
                    return;
                }

            });

        }],
    }, (err, response) => {
        console.log(response)
        callback(response.updateSubscribeinDB);
    })
}

/** subscriptionStatus */
let subscriptionStatus = (data,headers, callback) => {
    async.auto({
        checkSubscribeIdinDB: (cb) => {
            if (!data.userId) {
                cb(null, {
                    "statusCode": util.statusCode.BAD_REQUEST,
                    "statusMessage": util.statusMessage.PARAMS_MISSING
                })
                return;
            }
            let userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

            })
            let criteria = {
                "subscribingUserId": userId,
                "subscribedUserId": data.userId,
            }
            userDAO.subscribe(criteria, (err, dbData) => {
                //console.log(err, dbData)
                if (err) {
                    cb(null, {
                        "statusCode": util.statusCode.BAD_REQUEST,
                        "statusMessage": util.statusMessage.INVALID_USER_ID
                    });
                    return;
                }

                if (dbData.length == 0) {
                    console.log("subscribed  User Id not found");
                    cb(null, {
                        "statusCode": util.statusCode.BAD_REQUEST,
                        "statusMessage": util.statusMessage.INVALID_USER_ID
                    });
                    return;
                }

                userDAO.getSubscriptionStatus(criteria, (err, dbData) => {
                    console.log(err, dbData)
                    if (err) {
                        cb(null, {
                            "statusCode": util.statusCode.INTERNAL_SERVER_ERROR,
                            "statusMessage": util.statusMessage.DB_ERROR
                        });
                        return;
                    }
                    if (dbData && dbData.length == 0) {
                        
                        cb(dbData, {
                            "statusCode": util.statusCode.BAD_REQUEST,
                            "statusMessage": util.statusMessage.SUBSCRIPTION_NOT_FOUND
                        })
                        return;
                    }
                    else if (dbData && dbData.length != 0) {
                        
                        cb(dbData, {
                            "statusCode": util.statusCode.OK,
                            "statusMessage": dbData[0]
                        })
                        return;
                    } else {
                        cb(null)
                    }
                });
            });
        },

    }, (err, response) => {
        callback(response.checkSubscribeIdinDB);
    })
}

/** invitation */
let invitation = (data, headers, callback) => {
    async.auto({
        checkinvitationInDB: (cb) => {
            var userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

            })

            if (!data.invitedEmailAddress) {
                cb(null, {
                    "statusCode": util.statusCode.BAD_REQUEST,
                    "statusMessage": util.statusMessage.PARAMS_MISSING
                })
                return;
            }

            let criteria = {
                "userId": userId
            }

            userDAO.getUser(criteria, (err, dbData) => {

                if (err) {
                    cb(null, {
                        "statusCode": util.statusCode.INTERNAL_SERVER_ERROR,
                        "statusMessage": util.statusMessage.DB_ERROR
                    });
                    return;
                }
                let criteria = {
                    "email": data.invitedEmailAddress
                }
                userDAO.getUserByEmail(criteria, (err, getdbData) => {
                    //console.log(err, dbData);
                    if (err) {
                        cb(null, {
                            "statusCode": util.statusCode.INTERNAL_SERVER_ERROR,
                            "statusMessage": util.statusMessage.DB_ERROR
                        });
                        return;
                    }
                    if (getdbData.length != 0) {
                        cb(null, {
                            "statusCode": util.statusCode.BAD_REQUEST,
                            "result": util.statusMessage.EMAIL_EXIST
                        });
                        return;
                    } else {
                        let criteria = {
                            "invitedEmailAddress": data.invitedEmailAddress,
                            "invitingUserId": userId
                        }
                        userDAO.checkInvitation(criteria, (err, getData) => {
                            //console.log(err, getData);
                            if (err) {
                                cb(null, {
                                    "statusCode": util.statusCode.INTERNAL_SERVER_ERROR,
                                    "statusMessage": util.statusMessage.DB_ERROR
                                });
                                return;
                            }
                            if (getData.length != 0) {
                                cb(null, {
                                    "statusCode": util.statusCode.OK,
                                    "result": "Invitation Sent."
                                });
                                return;
                            } else {
                                cb(null)
                            }
                        })

                    }

                });
            })



        },
        addinvitatioinDB: ['checkinvitationInDB', (cb, functionData) => {
            //console.log("ankit", functionData)
            if (functionData && functionData.checkinvitationInDB) {
                cb(null, functionData.checkinvitationInDB);
                return;
            }


            // cb(null, {
            //     "statusCode": util.statusCode.OK,
            //     "result": util.statusMessage.INVALID_SUBSCRIPTION_ID
            // });
            // let criteria = {
            //     "subscriptionId": data.subscriptionId
            // }
            var userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

            })
            let dataToSet = {
                "invitingUserId": userId,
                "invitedEmailAddress": data.invitedEmailAddress
            }
            userDAO.addInvitation(dataToSet, (err, dbData) => {
                console.log(err, dbData);
                if (err) {
                    cb(null, {
                        "statusCode": util.statusCode.INTERNAL_SERVER_ERROR,
                        "statusMessage": util.statusMessage.DB_ERROR
                    });
                    return;
                }

                if (dbData.length != 0) {
                    util.sendInvitationEmail({
                        "email": data.invitedEmailAddress,

                    });

                    cb(null, {
                        "statusCode": util.statusCode.OK,
                        "result": "Invitation Sent"
                    });
                    return;
                }

            });

        }],
    }, (err, response) => {
        console.log(response)
        callback(response.addinvitatioinDB);
    })
}

/**get list of follower */
let followerList = (data,headers, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.userId) {
                cb(null, {
                    "statusCode": util.statusCode.BAD_REQUEST,
                    "statusMessage": util.statusMessage.PARAMS_MISSING
                })
                return;
            }
            let criteria = {
                "userId": data.userId,
            }
            console.log(criteria);
            userDAO.getfollowerList(criteria, (err, dbData) => {
                console.log(dbData, "ppppppp");
                console.log(err, "sdf")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                else {
                    cb(null, { "statusCode": util.statusCode.OK, "result": dbData });
                }
            });
        },
    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })


}

/**get list of followed */
let followedList = (data,headers, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.userId) {
                cb(null, {
                    "statusCode": util.statusCode.BAD_REQUEST,
                    "statusMessage": util.statusMessage.PARAMS_MISSING
                })
                return;
            }
            let criteria = {
                "userId": data.userId,
            }
            console.log(criteria);
            userDAO.getfollowedList(criteria, (err, dbData) => {
                //console.log(dbData,"ppppppp");
                //console.log(err,"sdf")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                else {
                    cb(null, { "statusCode": util.statusCode.OK, "result": dbData });
                }
            });
        },
    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })


}

/* Reply to Post */
let replyPost = (data, headers,files, callback) => {
    // console.log(data,"sdjhfhsdfjsd")
    async.auto({
        checkUserPostDB: (cb) => {
            if (!data.postId) {
                cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var userId
                util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

                })
                let criteria = {
                "userId": userId,
           }
            userDAO.getUsers(criteria, (err, dbData) => {

                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                } else {
                   // console.log(dbData, "drr")
                    let criteria = {
                        postId: data.postId,
                    }
                    userDAO.getPosts(criteria, (err, dbData) => {
                         console.log(dbData,"dae")
                        if (err) {
                            cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                            return;
                        } else {
                            let postImage;

                            if (files && files.postImage && files.postImage[0].filename && files.postImage[0].size > 0) {
                                postImage = files.postImage[0].filename;
                            }
                            let dataToSet = {
                                "userId": userId,
                                "text": data.text ? data.text : '',
                                "repostId": data.repostId ? data.repostId : '0',
                                "hashTag": data.hashTag ? data.hashTag : '',
                                //"postImage": files.postImage[0].filename,
                                "parentId": data.postId ? data.postId : '0'
                            }

                            console.log(dataToSet,'hdkashd')
                            if (postImage && postImage != "") {
                                dataToSet.postImage = postImage
                            }
                            userDAO.replyPost(dataToSet, (err, dbData) => {

                                // console.log(dbData, "dfda")
                                if (err) {
                                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                                    return;
                                }
                                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "Replied successfully" })
                            })
                        }
                    });

                }
            });
        },

    }, (err, response) => {
        callback(response.checkUserPostDB);
    })

}

/* RePost */
let repost = (data, headers,files, callback) => {
    // console.log(data,"sdjhfhsdfjsd")
    async.auto({
        checkUserPostDB: (cb) => {
            if (!data.postId) {
                cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            var userId
                util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

                })
                let criteria = {
                "userId": userId,
           }
            // let criteria = {
            //     userId: data.userId,
            // }
            userDAO.getUsers(criteria, (err, dbData) => {

                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                } else {
                    console.log(dbData, "drr")
                    let criteria = {
                        postId: data.postId,

                    }
                    userDAO.getPosts(criteria, (err, dbData) => {
                        if (err) {
                            cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                            return;
                        } else {
                            let dataToSet = {
                                "userId": userId,
                                "text": data.text ? data.text : '',
                                "repostId": data.postId ? data.postId : '0',
                                "hashTag": data.hashTag ? data.hashTag : '',
                                "postImage": (files.postImage) ? files.postImage[0].filename : "",
                                "parentId": dbData[0].parentId ? dbData[0].parentId : '0'
                            }
                            userDAO.repost(dataToSet, (err, dbData) => {

                                 console.log(dataToSet, "dfda")
                                if (err) {
                                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                                    return;
                                }
                                cb(null, { "statusCode": util.statusCode.OK, "statusMessage": "Reposted successfully" })
                            })
                        }
                    });

                }
            });
        },

    }, (err, response) => {
        callback(response.checkUserPostDB);
    })

}

/**get blocked user */
let getBlockUers = (criteria, cb) => {
    userDAO.getBlockedUser(criteria, (err, dbSubData) => {
        if (err) {
            cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
        }
        cb(null, dbSubData);
    })
}

/** Add Blocked User*/
let blockUser = (data,headers, callback) => {
    async.auto({
        checkblockIdinDB: (cb) => {
            var blockingUserId
         
            util.jwtDecode(headers.accesstoken, (err, token) => {
                blockingUserId = token

            })
           
            let criteria = {
                "blockingUserId": blockingUserId,
                "blockedUserId": data.userId,
            }
            console.log(criteria)
            // let criteria = {
            //     "blockingUserId": data.blockingUserId,
            //     "blockedUserId": data.blockedUserId,
            // }
            userDAO.getblockId(criteria, (err, dbData) => {
                console.log(err, "yty");
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                if (dbData.length != 0) {
                    cb(null, { "statusCode": util.statusCode.OK, "result": dbData[0] });
                }
                else {
                    let dataToSet = {
                        "blockingUserId": blockingUserId ? blockingUserId : '0',
                        "blockedUserId": data.userId ? data.userId : '0',
                        "blockStatus": "true",
                    }
                    console.log(dataToSet)
                    userDAO.blockedUser(dataToSet, (err, dbData) => {
                        if (err) {
                            cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                            return;
                        }
                        async.parallel({
                            blockingUser: (cb) => {
                                var criteria = {
                                    userId: dataToSet.blockingUserId
                                }
                                getBlockUers(criteria, (err, response) => {

                                    cb(null, response[0]);
                                });
                            },
                            blockedUser: (cb) => {
                                var criteria = {
                                    userId: dataToSet.blockedUserId
                                }
                                getBlockUers(criteria, (err, response) => {
                                    console.log(response, "wwww")
                                    cb(null, response[0]);
                                });
                            },


                        }, (err, response) => {

                            callback({ "statusCode": util.statusCode.OK, "statusMessage": response.blockingUser.fullName + " " + "blocks" + " " + response.blockedUser.fullName });
                        }),
                            (err) => {
                                callback(err);
                            }
                    });
                }

            });
        },
    }, (err, response) => {
        callback(response.checkblockIdinDB);
    })
}

/**get list of blocked user */
let blockUserList = (data,headers, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            var userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

            })
            let criteria = {
                "userId": userId,
            }
            userDAO.getblockUserList(criteria, (err, dbData) => {
                //console.log(err,"sdf")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                else {
                    cb(null, { "statusCode": util.statusCode.OK, "result": dbData });
                }
            });
        },
    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })


}

/**Delete post */
let deletePost = (data, headers, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {

            if (!data.postId) {
                cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            let userId
            util.jwtDecode(headers.accesstoken, (err, token) => {
                userId = token

            })
            
            let criteria = {
                "postId": data.postId,
                    userId : userId
            }
           
            userDAO.getPosts(criteria, (err, dbData) => {
                //console.log(err,dbData)
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                } 
                if (dbData && dbData.length!=0) {
                    
                    userDAO.deletePost(criteria, (err, dbData) => {
                    //    console.log(err,dbData)
                        if (err) {
                            cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                            return;
                        } else {
                            cb(null, { "statusCode": util.statusCode.OK, "result": "Post delete successfully." });

                        }
                    })

                } else {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": "You can't delete this post." });
                }
            });
        },
    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })


}

/** Post for Profile*/
let postForProfile = (data, callback) => {
    async.auto({
        checkUserNameExistsinDB: (cb) => {
            if (!data.userId) {
                cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            let criteria = {
                "userId": data.userId,
            }
            console.log(criteria);
            userDAO.getPostForProfile(criteria, (err, dbData) => {
               // console.log(dbData, "Tripti")
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                else {

                    cb(null, { "statusCode": util.statusCode.OK, "statusMessage": util.statusMessage.POST, "result": dbData });
                }
            });
        },
    }, (err, response) => {
        callback(response.checkUserNameExistsinDB);
    })

}


/**get user likes */
let userLikes = (data, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {

            let criteria = {
                "userId": data.userId,
            }
            userDAO.getUserLikes(criteria, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                else {
                    cb(null, { "statusCode": util.statusCode.OK, "result": dbData });
                }
            });
        },
    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })


}

/**get post likes */
let postLikes = (data, callback) => {
    async.auto({
        checkUserExistsinDB: (cb) => {
            if (!data.postId) {
                cb(null, { "statusCode": util.statusCode.BAD_REQUEST, "statusMessage": util.statusMessage.PARAMS_MISSING })
                return;
            }
            let criteria = {
                "postId": data.postId,
            }
            userDAO.getpostLikes(criteria, (err, dbData) => {
                if (err) {
                    cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR });
                    return;
                }
                else {
                    cb(null, { "statusCode": util.statusCode.OK, "result": dbData });
                }
            });
        },
    }, (err, response) => {
        callback(response.checkUserExistsinDB);
    })


}

/** unfollow */
let unfollow = (data,headers,callback) => {
    let userId
    util.jwtDecode(headers.accesstoken, (err, token) => {
        userId = token

    })
    async.auto({
        checkFollowerIdInDB: (cb) => {
            if (!data.userId ) {
                cb(null, {
                    "statusCode": util.statusCode.BAD_REQUEST,
                    "statusMessage": util.statusMessage.PARAMS_MISSING
                })
                return;
            }
            
            
            let criteria = {
                "followerId": userId,
                "followedId" : data.userId
            }
            let checkUsers = {
                "subscribingUserId": userId,
                "subscribedUserId":data.userId
            }
            userDAO.subscribe(checkUsers, (err, dbData) => {
                //console.log(err, dbData)
                if (err) {
                    cb(null, {
                        "statusCode": util.statusCode.BAD_REQUEST,
                        "statusMessage": util.statusMessage.INVALID_USER_ID
                    });
                    return;
                }

                if (dbData.length == 0) {
                    console.log("subscribed  User Id not found");
                    cb(null, {
                        "statusCode": util.statusCode.BAD_REQUEST,
                        "statusMessage": util.statusMessage.INVALID_USER_ID
                    });
                    return;
                }
                userDAO.getfollow(criteria, (err, dbData) => {
                    console.log(err, dbData)
                    if (err) {
                        cb(null, {
                            "statusCode": util.statusCode.BAD_REQUEST,
                            "statusMessage": util.statusMessage.DB_ERROR
                        });
                        return;
                    }
                    if (dbData && dbData.length == 0) {
                        
                        cb(null, {
                            "statusCode": util.statusCode.BAD_REQUEST,
                            "statusMessage": "Follower not found"
                        })
                        return;
                    }
                    else if (dbData && dbData.length != 0 && dbData[0].followStatus == 'false') {
                        cb(null, {
                            "statusCode": util.statusCode.BAD_REQUEST,
                            "statusMessage": "You already unfollow this user"
                        })
                        return;
                    } else {
                        cb(null)
                    }
                    
                    
                });
                
            })
            
        },
        updateFollowerinDB: ['checkFollowerIdInDB', (cb, functionData) => {
            console.log(cb, functionData)
            if (functionData && functionData.checkFollowerIdInDB) {
                cb(null, functionData.checkFollowerIdInDB);
                return;
            }

            let criteria = {
                "followerId": userId,
                "followedId" : data.userId
            }
            let dataToSet = {
                "followStatus" : "false"
            }
            userDAO.updateFollowStatus(criteria,dataToSet, (err, dbData) => {
                //console.log(err, dbData);
                if (err) {
                    cb(null, {
                        "statusCode": util.statusCode.INTERNAL_SERVER_ERROR,
                        "statusMessage": util.statusMessage.DB_ERROR
                    });
                    return;
                }

                if (dbData.length != 0) {
                    cb(null, {
                        "statusCode": util.statusCode.OK,
                        "result": "Unfollow successfully"
                    });
                    return;
                }

            });

        }],
    }, (err, response) => {
        console.log(response)
        callback(response.updateFollowerinDB);
    })
}

/** followStatus */
let followStatus = (data,headers, callback) => {
    let userId
    util.jwtDecode(headers.accesstoken, (err, token) => {
        userId = token

    })
    async.auto({
        checkFollowerIdinDB: (cb) => {
            if (!data.userId ) {
                cb(null, {
                    "statusCode": util.statusCode.BAD_REQUEST,
                    "statusMessage": util.statusMessage.PARAMS_MISSING
                })
                return;
            }
            
            let criteria = {
                "followerId": userId,
                "followedId" : data.userId
            }
            let checkUsers = {
                "subscribingUserId": userId,
                "subscribedUserId":data.userId
            }
            userDAO.subscribe(checkUsers, (err, dbData) => {
                //console.log(err, dbData)
                if (err) {
                    cb(null, {
                        "statusCode": util.statusCode.BAD_REQUEST,
                        "statusMessage": util.statusMessage.INVALID_USER_ID
                    });
                    return;
                }

                if (dbData.length == 0) {
                    console.log("subscribed  User Id not found");
                    cb(null, {
                        "statusCode": util.statusCode.BAD_REQUEST,
                        "statusMessage": util.statusMessage.INVALID_USER_ID
                    });
                    return;
                }

                userDAO.getfollowStatus(criteria, (err, dbData) => {
                    console.log(err, dbData)
                    if (err) {
                        cb(null, {
                            "statusCode": util.statusCode.INTERNAL_SERVER_ERROR,
                            "statusMessage": util.statusMessage.DB_ERROR
                        });
                        return;
                    }
                    if (dbData && dbData.length == 0) {
                        
                        cb(dbData, {
                            "statusCode": util.statusCode.BAD_REQUEST,
                            "statusMessage": "Follower not found"
                        })
                        return;
                    }
                    else if (dbData && dbData.length != 0) {
                        
                        cb(dbData, {
                            "statusCode": util.statusCode.OK,
                            "statusMessage": dbData[0]
                        })
                        return;
                    } else {
                        cb(null)
                    }
                });
            });
        },

    }, (err, response) => {
        callback(response.checkFollowerIdinDB);
    })
}
/* unblock user */
let unblock = (data,headers,callback) => {
    let userId
    util.jwtDecode(headers.accesstoken, (err, token) => {
        userId = token

    })
    async.auto({
        checkBlockingIdInDB: (cb) => {
            if (!data.userId ) {
                cb(null, {
                    "statusCode": util.statusCode.BAD_REQUEST,
                    "statusMessage": util.statusMessage.PARAMS_MISSING
                })
                return;
            }
            
            
            let criteria = {
                "blockingUserId": userId,
                "blockedUserId" : data.userId
            }
            let checkUsers = {
                "subscribingUserId": userId,
                "subscribedUserId":data.userId
            }
            userDAO.subscribe(checkUsers, (err, dbData) => {
                //console.log(err, dbData)
                if (err) {
                    cb(null, {
                        "statusCode": util.statusCode.BAD_REQUEST,
                        "statusMessage": util.statusMessage.INVALID_USER_ID
                    });
                    return;
                }

                if (dbData.length == 0) {
                   // console.log("subscribed  User Id not found");
                    cb(null, {
                        "statusCode": util.statusCode.BAD_REQUEST,
                        "statusMessage": util.statusMessage.INVALID_USER_ID
                    });
                    return;
                }
                userDAO.getblock(criteria, (err, dbData) => {
                   // console.log(err, dbData)
                    if (err) {
                        cb(null, {
                            "statusCode": util.statusCode.BAD_REQUEST,
                            "statusMessage": util.statusMessage.DB_ERROR
                        });
                        return;
                    }
                    if (dbData && dbData.length == 0) {
                        
                        cb(null, {
                            "statusCode": util.statusCode.BAD_REQUEST,
                            "statusMessage": "Blocking Relation not found"
                        })
                        return;
                    }
                    else if (dbData && dbData.length != 0 && dbData[0].blockStatus == 'false') {
                        cb(null, {
                            "statusCode": util.statusCode.BAD_REQUEST,
                            "statusMessage": "You already unblock this user"
                        })
                        return;
                    } else {
                        cb(null)
                    }
                    
                    
                });
                
            })
            
        },
        updateBlockinDB: ['checkBlockingIdInDB', (cb, functionData) => {
            console.log(cb, functionData)
            if (functionData && functionData.checkBlockingIdInDB) {
                cb(null, functionData.checkBlockingIdInDB);
                return;
            }

            let criteria = {
                "blockingUserId": userId,
                "blockedUserId" : data.userId
            }
            let dataToSet = {
                "blockStatus" : "false"
            }
            userDAO.updateblockStatus(criteria,dataToSet, (err, dbData) => {
                //console.log(err, dbData);
                if (err) {
                    cb(null, {
                        "statusCode": util.statusCode.INTERNAL_SERVER_ERROR,
                        "statusMessage": util.statusMessage.DB_ERROR
                    });
                    return;
                }

                if (dbData.length != 0) {
                    cb(null, {
                        "statusCode": util.statusCode.OK,
                        "result": "Unblock successfully"
                    });
                    return;
                }

            });

        }],
    }, (err, response) => {
        console.log(response)
        callback(response.updateBlockinDB);
    })
}

let addFields = async (dbData) =>{
    return new Promise((reso, reje)=>{
        let  loopArray = async function(dbData) {
            let  result = [];
            for(let item = 0; item < dbData.length;  item++ ){
               await getSubData(dbData[item]).then(res=>{
                   result.push(res)
               })
               
            }
            reso(result)
             
       }
       async function getSubData(data) {
            return new Promise((resolve,reject)=>{
               if(data.userImage && data.userImage != ''){
                    data.userImage = serverUrl+"/media/profileImage/"+data.userImage;
    
                }
                if(data.postImage && data.postImage != ''){
                    data.postImage = serverUrl+"/media/post/"+data.postImage
    
                }
                if(data.parentPostImage && data.parentPostImage != ''){
                    data.parentPostImage = serverUrl+"/media/post/"+data.parentPostImage
    
                }
                resolve(data)
                

            })
    }
    loopArray(dbData)

    })
    
     
    

}


module.exports = {
    signup: signup,
    login: login,
    loginWithGoogle: loginWithGoogle,
    loginWithFacebook: loginWithFacebook,
    forgotPassword: forgotPassword,
    updateForgotPassword: updateForgotPassword,
    verifyForgotPasswordLink: verifyForgotPasswordLink,
    changePassword: changePassword,
    updateFacebook: updateFacebook,
    updateGoogle: updateGoogle,
    profileUpdate: profileUpdate,
    createPost: createPost,
    searchByUserName: searchByUserName,
    searchByHashTag: searchByHashTag,
    getUser: getUser,
    feedPost: feedPost,
    singlePost: singlePost,
    profile: profile,
    like: like,
    follower: follower,
    notification: notification,
    updateDevicetoken: updateDevicetoken,
    getProfile: getProfile,
    getFeedCoin: getFeedCoin,
    subscribe: subscribe,
    unsubscribe: unsubscribe,
    subscriptionStatus: subscriptionStatus,
    invitation: invitation,
    followerList: followerList,
    followedList: followedList,
    replyPost: replyPost,
    repost: repost,
    blockUser: blockUser,
    blockUserList: blockUserList,
    deletePost: deletePost,
    postForProfile: postForProfile,
    userLikes: userLikes,
    postLikes: postLikes,
    unfollow : unfollow,
    followStatus : followStatus,
    postReplies:postReplies,
    notificationList:notificationList, 
    markNotification:markNotification,
    unblock:unblock,
    notificationsPreferences:notificationsPreferences,
};
