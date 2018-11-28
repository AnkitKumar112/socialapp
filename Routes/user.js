/*
* @Author: Ambuj Srivastava
* @Date: October 04, 2018
* @Last Modified by: Ambuj Srivastava
* @Last Modified On: November 05, 2018
*/


let express = require('express'),
    router = express.Router(),
    util = require('../Utilities/util'),
    userService = require('../Services/user');
authHandler = require('../middleware/verifyToken');


var fileExtension = require('file-extension')
var crypto = require('crypto')
var multer = require('multer')
var fs = require('fs');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/profileImage')
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            cb(null, raw.toString('hex') + Date.now() + '.' + fileExtension(file.mimetype));
        });
    }
});

let upload = multer({ storage: storage });
let cpUpload = upload.fields([{ name: 'userImage', maxCount: 1 }]);

let storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/post')
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            if (fileExtension(file.mimetype) == "form-data") {
                cb(null, raw.toString('hex') + Date.now() + '.png');
            }
            else {
                cb(null, raw.toString('hex') + Date.now() + '.' + fileExtension(file.mimetype));
            }
        });
    }
});
let upload2 = multer({ storage: storage2 });
let cpUpload2 = upload2.fields([{ name: 'postImage', maxCount: 1 }]);


/* signup */
router.post('/SignUp', (req, res) => {
    userService.signup(req.body, (data) => {
        res.send(data);
    });
});


/* User Login. */
router.post('/login', (req, res) => {
    userService.login(req.body, (data) => {
        res.send(data);
    });
});

/* Facebook Sign Up */
router.post('/loginWithFacebook', (req, res) => {
    userService.loginWithFacebook(req.body, (data) => {
        res.send(data);
    });
});

/**Update facebook API */
router.put('/facebook',authHandler.verifyToken, (req, res) => {
    //console.log(req.body)
    userService.updateFacebook(req.body,req.headers, (data) => {
        res.send(data);
    });
});

/* google Sign Up */
router.post('/loginWithGoogle', (req, res) => {
    userService.loginWithGoogle(req.body, (data) => {
        res.send(data);
    });
});

/** Update google API */
router.put('/google', authHandler.verifyToken, (req, res) => {
    userService.updateGoogle(req.body, req.headers, (data) => {
        res.send(data);
    });
})

/* User forgot password. */
router.post('/forgotPassword', (req, res) => {
    userService.forgotPassword(req.body, (data) => {
        res.send(data);
    });
});

/* Verify forgot password. */
router.post('/verifyForgotPasswordLink', (req, res) => {
    userService.verifyForgotPasswordLink(req.body, (data) => {
        res.send(data);
    });
});

/* Update forgot password. */
router.put('/updateForgotPassword', (req, res) => {
    userService.updateForgotPassword(req.body, (data) => {
        res.send(data);
    });
});

/* Change Password */
router.put('/changePassword', authHandler.verifyToken,  (req, res) => {
    userService.changePassword(req.body,req.headers, (data) => {
        res.send(data);
    });
});

/**user update profile */
router.put('/profileUpdate', authHandler.verifyToken, cpUpload, (req, res) => {
    userService.profileUpdate(req.body, req.files, req.headers, (data) => {
        res.send(data);
    });
});

/**create post by user */
router.post('/post', authHandler.verifyToken, cpUpload2, (req, res) => {
    userService.createPost(req.body, req.files, req.headers, (data) => {
        res.send(data);
    });
});


/* verify email */
router.get('/verifyEmail', (req, res) => {
    userService.verifyEmail(req.query, (data) => {
        res.send(data);
    });
});

router.post('/searchByUserName', authHandler.verifyToken, (req, res) => {
    userService.searchByUserName(req.body,req.headers, (data) => {
        res.send(data);
    });
});

router.post('/searchByHashTag',authHandler.verifyToken, (req, res) => {
    userService.searchByHashTag(req.body, req.headers, (data) => {
        res.send(data);
    });
});

router.get('/user', authHandler.verifyToken, (req, res) => {
    userService.getUser(req.body, req.headers, (data) => {
        res.send(data);
    });
});

router.get('/profile', authHandler.verifyToken, (req, res) => {
    userService.profile(req.query, req.headers, (data) => {
        res.send(data);
    });
});

router.get('/feedPost', authHandler.verifyToken, (req, res) => {
    // console.log(req.body)
    userService.feedPost(req.query, req.headers, (data) => {
        res.send(data);
    });
});
router.get('/post', authHandler.verifyToken, (req, res) => {
    userService.singlePost(req.body, req.headers, (data) => {
        res.send(data);
    });
});

router.get('/postReplies', authHandler.verifyToken, (req, res) => {
    userService.postReplies(req.query, req.headers, (data) => {
        res.send(data);
    });
});
router.post('/like', authHandler.verifyToken, (req, res) => {
    userService.like(req.body, req.headers, (data) => {
        res.send(data);
    });
});

router.post('/follower', authHandler.verifyToken,(req, res) => {
    userService.follower(req.body,req.headers,  (data) => {
        res.send(data);
    });
});
router.put('/updateDeviceToken', authHandler.verifyToken, (req, res) => {
    userService.updateDevicetoken(req.body, req.headers, (data) => {
        res.send(data);
    });
});

router.post('/notification', authHandler.verifyToken, (req, res) => {
    userService.notification(req.body, req.headers, (data) => {
        res.send(data);
    });
});
router.get('/notification', authHandler.verifyToken, (req, res) => {
    userService.notificationList(req.body, req.headers, (data) => {
        res.send(data);
    });
});
router.put('/markNotification', authHandler.verifyToken, (req, res) => {
    userService.markNotification(req.body, req.headers, (data) => {
        res.send(data);
    });
});
router.post('/notificationsPreferences', authHandler.verifyToken, (req, res) => {
    userService.notificationsPreferences(req.body, req.headers, (data) => {
        res.send(data);
    });
});

router.get('/searchPost', authHandler.verifyToken, (req, res) => {
    userService.feedPost(req.query, req.headers, (data) => {
        res.send(data);
    });
});

router.post('/subscribe',authHandler.verifyToken, (req, res) => {
    userService.subscribe(req.body,req.headers, (data) => {
        res.send(data);
    });
});

router.post('/unsubscribe',authHandler.verifyToken, (req, res) => {
    userService.unsubscribe(req.body,req.headers, (data) => {
        res.send(data);
    });
});

router.post('/subscriptionStatus',authHandler.verifyToken, (req, res) => {
    userService.subscriptionStatus(req.body,req.headers, (data) => {
        res.send(data);
    });
});

router.post('/invitation', authHandler.verifyToken, (req, res) => {
    userService.invitation(req.body, req.headers, (data) => {
        res.send(data);
    });
});
// List of followers /
router.get('/followerList', authHandler.verifyToken,(req, res) => {
    userService.followerList(req.query,req.headers, (data) => {
        res.send(data);
    });
});


// List of followed /
router.get('/followedList',authHandler.verifyToken, (req, res) => {
    userService.followedList(req.query, req.headers, (data) => {
        res.send(data);
    });
});
/**reply post by user */
router.post('/replyPost', authHandler.verifyToken,cpUpload2, (req, res) => {
    userService.replyPost(req.body,req.headers, req.files, (data) => {
        res.send(data);
    });
});
/**repost by user */
router.post('/repost',authHandler.verifyToken, cpUpload2, (req, res) => {
    userService.repost(req.body,req.headers, req.files, (data) => {
        res.send(data);
    });
});

// Add Blocked User /
router.post('/blockUser', authHandler.verifyToken,(req, res) => {
    userService.blockUser(req.body,req.headers, (data) => {
        res.send(data);
    });
});

// List of blocked user /
router.get('/blockUserList',authHandler.verifyToken, (req, res) => {
    userService.blockUserList(req.query, req.headers,(data) => {
        res.send(data);
    });
});

// Delete user post /
router.delete('/post', authHandler.verifyToken,(req, res) => {
    userService.deletePost(req.query,req.headers, (data) => {
        res.send(data);
    });
});


// post for profile /
router.get('/postForProfile', authHandler.verifyToken,(req, res) => {
    userService.postForProfile(req.query, (data) => {
        res.send(data);
    });
});
// unfollow user /
router.post('/unfollow', authHandler.verifyToken, (req, res) => {
    userService.unfollow(req.body,req.headers,  (data) => {
        res.send(data);
    });
});

// unfollow user status /
router.post('/followStatus', authHandler.verifyToken, (req, res) => {
    userService.followStatus(req.body,req.headers, (data) => {
        res.send(data);
    });
});
// user likes /
router.get('/userLikes', authHandler.verifyToken,(req, res) => {
    userService.userLikes(req.query, (data) => {
    res.send(data);
    });
});
// post likes /
router.get('/postLikes',authHandler.verifyToken, (req, res) => {
    userService.postLikes(req.query, (data) => {
    res.send(data);
    });
});

// unblock user /
router.post('/unblock', authHandler.verifyToken, (req, res) => {
    userService.unblock(req.body,req.headers,  (data) => {
        res.send(data);
    });
});

module.exports = router;
