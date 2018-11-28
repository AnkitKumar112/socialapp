'use strict';

let dbConfig = require("../Utilities/dbConfig");


let createUser = (dataToSet, callback) => {
    dbConfig.getDB().query("insert into user set ? ", dataToSet, callback);

}

let createUserInfo = (dataToSet, callback) => {
    dbConfig.getDB().query("insert into user_info set ? ", dataToSet, callback);
}

let createPost = (dataToSet, callback) => {
    dbConfig.getDB().query("insert into post set ? ", dataToSet, callback);
}

let addFollower = (dataToSet, callback) => {
    dbConfig.getDB().query("insert into follower_followed set ? ", dataToSet, callback);
}

let likePost = (dataToSet, callback) => {
    dbConfig.getDB().query(`insert into like_post set ? `, dataToSet, callback);
}
let updateLikePost = (criteria, dataToSet, callback) => {
    let conditions = "";
    let setData = "";
    if(dataToSet.likeStatus == 'true'){
        setData=" likeStatus = 'false'"
    }else{
        setData=" likeStatus = 'true'"
    }
    criteria.userId ? conditions += ` and userId = '${criteria.userId}'` : true;
    criteria.postId ? conditions += ` and postId = '${criteria.postId}'` : true;
    dbConfig.getDB().query(`UPDATE like_post  SET ${setData} where 1 ${conditions}  `, dataToSet, callback);
}

let updateUser = (criteria, dataToSet, callback) => {
    let conditions = "";
    let setData = "";
    criteria.email ? conditions += ` and email = '${criteria.email}'` : true;
    criteria.userId ? conditions += ` and userId = '${criteria.userId}'` : true;
    criteria.facebookId ? conditions += ` and facebookId = '${criteria.facebookId}'` : true;
    criteria.googleId ? conditions += ` and googleId = '${criteria.googleId}'` : true;
    criteria.userName ? conditions += ` and userName = '${criteria.userName}'` : true;
    dataToSet.password ? setData += ` password = '${dataToSet.password}'` : true;
    dataToSet.forgotToken ? setData += ` forgotToken = '${dataToSet.forgotToken}'` : true;
    dataToSet.forgotOTP ? setData += `, forgotOTP = '${dataToSet.forgotOTP}'` : true;
    dataToSet.userName ? setData += ` userName = '${dataToSet.userName}'` : true;
    dataToSet.fullName ? setData += ` fullName = '${dataToSet.fullName}'` : true;
    dataToSet.facebookId ? setData += ` facebookId = '${dataToSet.facebookId}'` : true;
    dataToSet.googleId ? setData += ` googleId = '${dataToSet.googleId}'` : true;

    //console.log(`UPDATE user SET ${setData} where 1 ${conditions}`);
    dbConfig.getDB().query(`UPDATE user SET ${setData} where 1 ${conditions}`, callback);
}

let updateUserInfo = (criteria, dataToSet, callback) => {
    let conditions = "";
    let setData = "";
    criteria.userId ? conditions += ` and userId = '${criteria.userId}'` : true;
    dataToSet.bio ? setData += `  bio = '${dataToSet.bio}',` : true;
    dataToSet.location ? setData += ` location = '${dataToSet.location}',` : true;
    dataToSet.website ? setData += `  website = '${dataToSet.website}',` : true;
    dataToSet.userImage ? setData += `  userImage = '${dataToSet.userImage}',` : true;
    dataToSet.birthDate ? setData += `  birthDate = '${dataToSet.birthDate}',` : true;
    
    setData = setData.slice(0, -1);

    //console.log(`UPDATE user_info SET ${setData} where 1 ${conditions}`)
    dbConfig.getDB().query(`UPDATE user_info SET ${setData} where 1 ${conditions}`);
}

let updateUserPassword = (criteria, dataToSet, callback) => {
    let conditions = "";
    let setData = "";
    criteria.userId ? conditions += ` and userId = '${criteria.userId}'` : true;
    dataToSet.password ? setData += ` password = '${dataToSet.password}'` : true;

    //console.log(`UPDATE user SET ${setData} where 1 ${conditions}`);
    dbConfig.getDB().query(`UPDATE user SET ${setData} where 1 ${conditions}`, callback);
}
let getUserPassword = (criteria, callback) => {
    let conditions = "";


    criteria.userId ? conditions += ` and userId = '${criteria.userId}'` : true;
    criteria.password ? conditions += ` and password = '${criteria.password}'` : true;

    dbConfig.getDB().query(`select userId,userName,fullName,email,forgotToken,forgotOTP,googleId,facebookId,password from user where 1 ${conditions}`, callback);
}

let getUsers = (criteria, callback) => {
    let conditions = "";

    criteria.fullName ? conditions += `and fullName = '${criteria.fullName}'` : true;
    criteria.email ? conditions += ` and email = '${criteria.email}'` : true;
    criteria.userName ? conditions += ` and userName = '${criteria.userName}'` : true;
    criteria.userId ? conditions += ` and userId = '${criteria.userId}'` : true;
    criteria.password ? conditions += ` and password = '${criteria.password}'` : true;
    criteria.facebookId ? conditions += ` and facebookId = '${criteria.facebookId}'` : true;
    criteria.googleId ? conditions += ` and googleId = '${criteria.googleId}'` : true;
    criteria.forgotOTP ? conditions += ` and forgotOTP = '${criteria.forgotOTP}'` : true;
    criteria.forgotToken ? conditions += ` and forgotToken = '${criteria.forgotToken}'` : true;
    dbConfig.getDB().query(`select userId,userName,fullName,email,forgotToken,forgotOTP,googleId,facebookId from user where 1 ${conditions}`, callback);
}

let getUser = (criteria, callback) => {
    let conditions = "";
    criteria.userId ? conditions += ` and userId = '${criteria.userId}'` : true;
    dbConfig.getDB().query(`select userId,userName,fullName,email from user where 1 ${conditions}`, callback);
}

let getUserProfile = (criteria, callback) => {
    let conditions = "";
    criteria.userId ? conditions += `  user.userId = '${criteria.userId}'` : true;
    dbConfig.getDB().query(`select user.userName,user.fullName,user.email,user_info.bio,user_info.location,user_info.website,user_info.birthDate, user_info.userImage from user left join user_info on user.userId = user_info.userId where  ${conditions}`, callback);
    //dbConfig.getDB().query(`select userId,userName,fullName,email from user where 1 ${conditions}`, callback);
}


let getUserByUserName = (criteria, callback) => {
    let conditions = "";
    criteria.userName ? conditions += `and userName like  '%${criteria.userName}%'` : true;
    dbConfig.getDB().query(`select user.userName,user.fullName,user.email,user_info.bio,user_info.location,user_info.website,user_info.birthDate, user_info.userImage from user left join user_info on user.userId = user_info.userId where 1 ${conditions}`, callback);
    console.log(`select user.userName,user.fullName,user.email,user_info.bio,user_info.location,user_info.website,user_info.birthDate from user left join user_info on user.userId = user_info.userId where 1 ${conditions}`)
}

let getHashTag = (criteria, callback) => {
    let conditions = "";

    criteria.hashTag ? conditions += ` hashTag like  '%${criteria.hashTag}%'` : true;
    //console.log(conditions)

    dbConfig.getDB().query(`select postId,text,postImage,hashTag from post where  ${conditions}`, callback);
    // console.log(`select postId,text,postImage,hashTag from post where  ${conditions}`)
}

let getUsersLogin = (criteria, callback) => {
    let conditions = "";

    criteria.email ? conditions += `and (email = '${criteria.email}' OR  userName = '${criteria.email}')` : true;
    criteria.password ? conditions += ` and password = '${criteria.password}'` : true;

    dbConfig.getDB().query(`select userId,userName,fullName,email,forgotToken,forgotOTP,facebookId from user where 1 ${conditions}`, callback);
    //console.log(`select userId,userName,fullName,email,forgotToken,forgotOTP,facebookId from user where 1 ${conditions}`)
}

let getUserInfo = (criteria, callback) => {
    let conditions = "";
    criteria.userId ? conditions += `and userId = '${criteria.userId}'` : true;
    dbConfig.getDB().query(`select userId,bio,location,website,userImage,birthDate from user_info where 1 ${conditions}`, callback);
}

let getPostReplies = (criteria, callback) => {
    let conditions = "";
    criteria.userId ? conditions += `and userId = '${criteria.userId}'` : true;
    criteria.parentId ? conditions += `and parentId = '${criteria.parentId}'` : true;
    dbConfig.getDB().query(`select  post.postId, post.repostId, post.text, post.postImage, post.hashTag, post.parentId, post.userId, user.userName, user.fullName, user_info.userImage,post.createdOn
    from post 
    LEFT JOIN user ON post.userId = user.userId
    LEFT JOIN user_info ON post.userId = user_info.userId
    where 1   ${conditions} ORDER BY post.createdOn DESC `, callback);
}


let getUserPost = async (criteria, callback) => {
    let conditions = "";
    criteria.userId ? conditions += `post.userId = '${criteria.userId}'` : true;
    criteria.hashTag ? conditions += `post.hashTag LIKE '%${criteria.hashTag}%'` : true;
    if(criteria.searchPost){
        let feed = criteria.searchPost.toLowerCase().split("or");
       // console.log(feed)
        let likeString = ""
        for(let i=0; i< feed.length; i++){
            if(i == 0)
                likeString += `post.text LIKE '%${feed[i]}%' `
            else
                likeString += `or post.text LIKE '%${feed[i]}%' `
        }
        //console.log(likeString)
        criteria.searchPost ? conditions += ` and ${likeString}` : true;
    }
    //console.log("CONDI",conditions)
    dbConfig.getDB().query(`SELECT distinct post.userId, user.userName, user.fullName, user_info.userImage, post.postId, post.repostId, post.text, post.postImage, post.hashTag, post.parentId, post.createdOn, (

        SELECT COUNT( likeId ) 
        FROM like_post
        WHERE postId = post.postId
        ) AS likeCounter, (
        
        SELECT COUNT( post2.postId ) 
        FROM post AS post2
        WHERE post2.repostId = post.postId
        ) AS repostCounter, (
        
        SELECT COUNT( post3.postId ) 
        FROM post AS post3
        WHERE post3.parentId = post.postId
        ) AS replyCounter
        FROM post
        LEFT JOIN user ON post.userId = user.userId
        LEFT JOIN user_info ON post.userId = user_info.userId
        LEFT JOIN follower_followed ON post.userId = follower_followed.followerId
        WHERE  
        ${conditions} or post.userId IN (SELECT followedId from follower_followed WHERE followerId ='${criteria.userId}') ORDER BY post.createdOn DESC `, (err, dbData)=>{
            if(err) {callback(err,dbData) ; return;}
             let  loopArray = async function(dbData) {
             let  result = [];
             for(let item = 0; item < dbData.length;  item++ ){
                await getSubData(dbData[item]).then(res=>{
                    result.push(res)
                })
                             
             }
             await getFollowerLikePost().then(async data4=>{
                for(let item = 0; item < data4.length;  item++ ){
                    let obj = dbData.find(o => o.postId == data4[item].postId );
                    if(!obj){
                        await getUserFollowerPost({postId:data4[item].postId, userId:data4[item].userId}).then((data5)=>{
                            result.push(data5[0])
                        })
                    }
                }
                
             })
             callback(null, result)
           
        }
          
         async function getSubData(data) {
             return new Promise((resolve,reject)=>{
                if(data.repostId != 0 || data.parentId!=0){
                     let conditions = ""
                     if(data.repostId != 0 ){
                         conditions = 'postId='+data.repostId
                     }else if(data.parentId && data.parentId != 0 ){
                        conditions = 'postId='+data.parentId
                    }
                    else{
                        resolve(data)
                    }
                     dbConfig.getDB().query(`SELECT distinct user.userName as parentUserName, user.fullName as parentFullName,  post.text parentText, post.postImage as parentPostImage
                     FROM post
                     LEFT JOIN user ON post.userId = user.userId
                     WHERE  ${conditions}
                    `,(suberr,subData)=>{
                        if(suberr){ reject(suberr) ; return;}
                         data.parentUserName = subData[0].parentUserName
                         data.parentFullName = subData[0].parentFullName
                         data.parentText = subData[0].parentText
                         data.parentPostImage = subData[0].parentPostImage

                            // let conditions = "l.postId = "+data.postId;
                        
                            // dbConfig.getDB().query(`SELECT l.userId,user.userName FROM like_post as l 
                            // LEFT JOIN user ON l.userId = user.userId
                            // WHERE  ${conditions} `, (err3,data3)=>{
                            //     data.likes = data3
                                
                            // });
                            resolve(data)
                    })  
                 }else{
                    // let conditions = "l.postId = "+data.postId;
                        
                    // dbConfig.getDB().query(`SELECT l.userId,user.userName FROM like_post as l 
                    // LEFT JOIN user ON l.userId = user.userId
                    // WHERE  ${conditions} `, (err3,data3)=>{
                    //     data.likes = data3
                        
                    // });
                    resolve(data)
                 }
    
             })
        }

        async function getFollowerLikePost() {
            return new Promise((resolve,reject)=>{
                dbConfig.getDB().query(`select userId, postId from like_post where userId IN (SELECT followedId from follower_followed WHERE followerId ='${criteria.userId}')`, (err4,data4)=>{
                    if(err4) reject(err4)
                    resolve(data4) 
                     
               })
            })
        }
        loopArray(dbData)
        });
}

let getUserFollowerPost = async (criteria, callback) => {
    let conditions = "";
    criteria.postId ? conditions += `post.postId = '${criteria.postId}'` : true;
    return new Promise((resolveP,rejectP)=>{
        dbConfig.getDB().query(`SELECT distinct post.userId, user.userName, user.fullName, user_info.userImage, post.postId, post.repostId, post.text, post.postImage, post.hashTag, post.parentId, post.createdOn, (

            SELECT COUNT( likeId ) 
            FROM like_post
            WHERE postId = post.postId
            ) AS likeCounter, (
            
            SELECT COUNT( post2.postId ) 
            FROM post AS post2
            WHERE post2.repostId = post.postId
            ) AS repostCounter, (
            
            SELECT COUNT( post3.postId ) 
            FROM post AS post3
            WHERE post3.parentId = post.postId
            ) AS replyCounter
            FROM post
            LEFT JOIN user ON post.userId = user.userId
            LEFT JOIN user_info ON post.userId = user_info.userId
            LEFT JOIN follower_followed ON post.userId = follower_followed.followerId
            WHERE 
            ${conditions} or post.userId IN (SELECT followedId from follower_followed WHERE followerId ='${criteria.userId}')  ORDER BY post.createdOn DESC`, (err, dbData)=>{
                if(err) {rejectP(err) ; return;}
                 let  loopArray = async function(dbData) {
                    await getSubData(dbData[0]).then(res=>{
                    })
                resolveP(dbData)
               
            }
              
             async function getSubData(data) {
                 //console.log("ANKIT",data)
                 return new Promise((resolve,reject)=>{
                    if((data.repostId && data.repostId != 0) || (data.parentId && data.parentId!=0)){
                         let conditions = ""
                         if(data.repostId && data.repostId != 0 ){
                             conditions = 'postId='+data.repostId
                         }else{
                             conditions = 'postId='+data.parentId
                         }
                         dbConfig.getDB().query(`SELECT distinct user.userName as parentUserName, user.fullName as parentFullName,  post.text parentText, post.postImage as parentPostImage
                         FROM post
                         LEFT JOIN user ON post.userId = user.userId
                         WHERE   ${conditions}
                        `,(suberr,subData)=>{
                            if(suberr){ reject(suberr) ; return;}
                             data.parentUserName = subData[0].parentUserName
                             data.parentFullName = subData[0].parentFullName
                             data.parentText = subData[0].parentText
                             data.parentPostImage = subData[0].parentPostImage
    
                                data.likeduserId            =    data.userId        ;delete(data.userId)
                                data.likedPostId            =    data.postId        ;delete(data.postId)
                                data.likedPostUserName      =    data.userName      ;delete(data.userName)    
                                data.likedPostFullName      =    data.fullName      ;delete(data.fullName)
                                data.likedPostText          =    data.text          ;delete(data.text)
                                data.likedPostImage         =    data.postImage     ;delete(data.postImage)
                                data.likedPostCreatedOn     =    data.createdOn     ;delete(data.createdOn)
                                data.likedPostLikeCounter   =    data.likeCounter   ;delete(data.likeCounter)
                                data.likedPostRepostCounter =    data.repostCounter ;delete(data.repostCounter)
                                data.likedPostReplyCounter  =    data.replyCounter  ;delete(data.replyCounter)

                                dbConfig.getDB().query(`SELECT user.userId,user.userName, user.fullName , like_post.createdOn FROM user
                                LEFT JOIN like_post ON like_post.userId = user.userId
                                WHERE  user.userId =${criteria.userId} `, (err3,data3)=>{
                                    if(err3){ reject(err3) ; return;}
                                	if(data3 && data3.length!=0){
                                		data.userId =data3[0].userId;
	                                    data.userName =data3[0].userName
	                                    data.fullName  =data3[0].fullName
	                                    data.createdOn = data3[0].createdOn
                                	}
                                    
                                    resolve(data)

                                });
                        })  
                     }else{

                                data.likeduserId            =    data.userId        ;delete(data.userId)
                                data.likedPostId            =    data.postId        ;delete(data.postId)
                                data.likedPostUserName      =    data.userName      ;delete(data.userName)    
                                data.likedPostFullName      =    data.fullName      ;delete(data.fullName)
                                data.likedPostText          =    data.text          ;delete(data.text)
                                data.likedPostImage         =    data.postImage     ;delete(data.postImage)
                                data.likedPostCreatedOn     =    data.createdOn     ;delete(data.createdOn)
                                data.likedPostLikeCounter   =    data.likeCounter   ;delete(data.likeCounter)
                                data.likedPostRepostCounter =    data.repostCounter ;delete(data.repostCounter)
                                data.likedPostReplyCounter  =    data.replyCounter  ;delete(data.replyCounter)
                                dbConfig.getDB().query(`SELECT user.userId,user.userName, user.fullName , like_post.createdOn FROM user
                                LEFT JOIN like_post ON like_post.userId = user.userId
                                WHERE  user.userId =${criteria.userId} `, (err3,data3)=>{
                                    if(err3){ reject(err3) ; return;}
                                	if(data3 && data3.length!=0){
                                		data.userId =data3[0].userId;
	                                    data.userName =data3[0].userName
	                                    data.fullName  =data3[0].fullName
	                                    data.createdOn = data3[0].createdOn
                                	}
                                    
                                    resolve(data)

                                });
                     }
        
                 })
            }
            loopArray(dbData)
            });
    });

}

let getBlocked = (criteria, callback) => {
    let conditions = "";

    criteria.blockedUserId ? conditions += `and blockedUserId = '${criteria.blockedUserId}'` : true;

    dbConfig.getDB().query(`SELECT count(followedId) FROM follower_followed WHERE followerId  ${conditions}`, callback);
    //console.log(`SELECT count(followedId) FROM follower_followed WHERE followerId 1 ${conditions}`)
}

let getFollower = (criteria, callback) => {
    let conditions = "";

    criteria.followerId ? conditions += `and followerId = '${criteria.followerId}'` : true;

    dbConfig.getDB().query(`SELECT count(followedId) FROM follower_followed WHERE followerId  ${conditions}`, callback);
    //console.log(`SELECT count(followedId) FROM follower_followed WHERE followerId 1 ${conditions}`)
}

let getFollowed = (criteria, callback) => {
    let conditions = "";

    criteria.followedId ? conditions += `and followedId = '${criteria.followedId}'` : true;

    dbConfig.getDB().query(`SELECT count(followerId) FROM follower_followed WHERE followedId  ${conditions}`, callback);
    //console.log(`SELECT count(followerId) FROM follower_followed WHERE followedId 1 ${conditions}`)
}

let getLike = (criteria, callback) => {
    let conditions = "";

    conditions += (` userId = '${criteria.userId}' AND postId = '${criteria.postId}'`);
    console.log(conditions)

    dbConfig.getDB().query(`select likeId, likeStatus from like_post where ${conditions}`, callback);
    console.log(`select likeId from like_post where ${conditions}`)
}

let getfollowId = (criteria, callback) => {
    let conditions = "";

    conditions += (` followerId = '${criteria.followerId}' AND followedId = '${criteria.followedId}' AND followStatus = 'true'`);
    //console.log(conditions)

    dbConfig.getDB().query(`select relationId from follower_followed where ${conditions}`, callback);
    //console.log(`select relationId from follower_followed where ${conditions}`)
}

let getAddFollower = (criteria, callback) => {
    let conditions = "";

    criteria.userId ? conditions += `and userId = '${criteria.userId}'` : true;

    dbConfig.getDB().query(`select fullName from user where 1 ${conditions}`, callback);
    //console.log(`SELECT count(userId) FROM like WHERE postId 1 ${conditions}`)
}

let getProfile = (criteria, callback) => {
    let conditions = "";

    criteria.userId ? conditions += ` user.userId = '${criteria.userId}'` : true;
    dbConfig.getDB().query(`SELECT distinct user.userId, user.userName, user.fullName, user_info.userImage,user_info.bio,user_info.website,user_info.birthDate,user_info.location, (

        SELECT COUNT( relationId )
        FROM follower_followed
        WHERE followerId = user.userId
        ) AS followedCounter, (

         SELECT COUNT( relationId )
        FROM follower_followed
        WHERE followedId = user.userId
        ) AS followerCounter, (

         SELECT COUNT( blockId )
        FROM block_users
        WHERE blockingUserId = user.userId
        ) AS blockCounter

        FROM user 
        INNER JOIN user_info ON user.userId = user_info.userId
        where 1 and  ${conditions}`, callback);
    //console.log(`select user.userName,user.fullName,user.email,user_info.bio,user_info.location,user_info.website,user_info.birthDate,user_info.userImage from user left join user_info on user.userId = user_info.userId where ${conditions}`)
}

//select post.userId,post.link,post.title,post.expression_code,post.expression,post.tag,post.activity,user.fullName,user.profilePicture from post INNER JOIN user ON post.userId = user.userId where 1 ${conditions}

let updateUserDevicetoken = (criteria, dataToSet, callback) => {
    let conditions = "";
    let setData = "";
    //console.log(dataToSet)
    criteria.userId ? conditions += ` and userId = '${criteria.userId}'` : true;
    criteria.deviceId ? conditions += ` and deviceId = '${criteria.deviceId}'` : true;
    dataToSet.deviceType ? setData += `  deviceType = '${dataToSet.deviceType}'` : true;
    dataToSet.userDeviceToken ? setData += `, userDeviceToken = '${dataToSet.userDeviceToken}'` : true;

    //console.log(`UPDATE user_device SET ${setData} where 1 ${conditions}`)
    dbConfig.getDB().query(`UPDATE user_device SET ${setData} where 1 ${conditions}`, (err, data) => {
        if (err) { callback(err); return }
        if (data.affectedRows == 0) {
            console.log(dataToSet);
            dbConfig.getDB().query("insert into user_device set ? ", dataToSet, callback);
            return
        }
        callback(err, data)
    });
}


let notification = (criteria, dataToSet, callback) => {
    let conditions = ""
    let deviceToken = ""
    criteria.userId ? conditions += ` and userId = '${criteria.userId}'` : true;
    dbConfig.getDB().query("insert into notifications set ? ", dataToSet, callback);

}

let addNotificationsPreferences = (dataToSet, callback) => {
    dbConfig.getDB().query("insert into notifications_preferences set ? ", dataToSet, callback);
}
let getNotificationsPreferences = (criteria,  callback) => {
    let conditions = ""
    criteria.userId ? conditions += ` and userId = '${criteria.userId}'` : true;
    criteria.notificationType ? conditions += ` and notificationType = '${criteria.notificationType}'` : true;
    dbConfig.getDB().query(`select * from  notifications_preferences WHERE 1 ${conditions}`, callback);

}
let updateNotificationsPreferences = (criteria, dataToSet, callback) => {
    let conditions = ""
    let setData = ""
    criteria.userId ? conditions += ` and userId = '${criteria.userId}'` : true;
    criteria.notificationType ? conditions += ` and notificationType = '${criteria.notificationType}'` : true;
    dataToSet.status ? setData += ` status = '${dataToSet.status}'` : true;
    dbConfig.getDB().query(`UPDATE  notifications_preferences  SET ${setData} WHERE 1 ${conditions}`, callback);

}
let getUserDeviceToken = (criteria, callback) => {
    let conditions = "";

    criteria.userId ? conditions += ` and userId = '${criteria.userId}'` : true;
    dbConfig.getDB().query(`SELECT userDeviceToken from user_device   WHERE  1 ${conditions} `, callback);
    //console.log(`select postId,repostId,parentId, userId,text,postImage,hashTag from post where 1 ${conditions}`)
}

let notificationList = (criteria, callback) => {
    let conditions = "";

    criteria.triggeringUserId ? conditions += ` and triggeringUserId = '${criteria.triggeringUserId}'` : true;
    criteria.receivingUserId ? conditions += ` and receivingUserId = '${criteria.receivingUserId}'` : true;
    criteria.notificationId ? conditions += ` and notificationId = '${criteria.notificationId}'` : true;
    dbConfig.getDB().query(`SELECT notificationId,receivingUserId,
    triggeringUserId,type,postId,seen,
    (select userName from user where userid = receivingUserId) as receivingUserName,
    (select userName from user where userid = triggeringUserId) as triggeringUserName,
    (select userImage from user_info where userid = triggeringUserId) as triggeringUserImage,
    createdOn  
    from notifications   
    WHERE  1 ${conditions} ORDER BY createdOn DESC`, callback);
    //console.log(`select postId,repostId,parentId, userId,text,postImage,hashTag from post where 1 ${conditions}`)
}

let updateNotification = (criteria, dataToSet, callback) => {
    // console.log(criteria);
    let conditions = "";
    let setData = ""
    let ids = criteria.notificationId.split(',')
    //console.log("ID",ids)
    criteria.triggeringUserId ? conditions += ` and triggeringUserId = '${criteria.triggeringUserId}'` : true;
    criteria.receivingUserId ? conditions += ` and receivingUserId = '${criteria.receivingUserId}'` : true;
    criteria.notificationId ? conditions += ` and notificationId IN (${ids})` : true;
    dataToSet.seen ? setData += `  seen = '${dataToSet.seen}'` : true;
    console.log(`UPDATE notifications SET ${setData} where 1 ${conditions}`)
    dbConfig.getDB().query(`UPDATE notifications SET ${setData} where 1 ${conditions}`, callback);


}

let getUserFeedCoin = (criteria, callback) => {
    let conditions = "";
    let feed = criteria.coinFeed.toLowerCase().split("or");
    //console.log(feed)
    let likeString = ""
    for(let i=0; i< feed.length; i++){
        if(i == 0)
            likeString += `post.text LIKE '%${feed[i]}%' `
        else
            likeString += `or post.text LIKE '%${feed[i]}%' `
    }
    //console.log(likeString)
    criteria.userId ? conditions += `and post.userId = '${criteria.userId}' ` : true;
    criteria.coinFeed ? conditions += ` and ${likeString}` : true;
   // console.log(conditions)
    dbConfig.getDB().query(`SELECT post.userId, post.postId, post.repostId, post.text, post.postImage, post.hashTag, post.parentId, user_info.bio, user_info.userImage
    FROM post
    INNER JOIN user_info ON post.userId = user_info.userId
    WHERE 1  ${conditions} `, callback);
    //console.log(`select postId,repostId,parentId, userId,text,postImage,hashTag from post where 1 ${conditions}`)
}
let subscribe = (criteria, callback) => {
    let conditions = "";

    criteria.subscribingUserId ? conditions += `and userId = '${criteria.subscribingUserId}'` : true;

    dbConfig.getDB().query(`select fullName from user where 1 ${conditions}`, (err, data) => {
        if (err) { callback(err); return }
        console.log(data.length);
        if (data.length == 0) {
            callback("Subscribing User Id not found");
            return
        }
        let conditions = "";
        criteria.subscribedUserId ? conditions += `and userId = '${criteria.subscribedUserId}'` : true;
        dbConfig.getDB().query(`select fullName from user where 1 ${conditions}`, callback)
    });
    //console.log(`SELECT count(userId) FROM like WHERE postId 1 ${conditions}`)
}

let addSubscribe = (dataToSet, callback) => {
    // console.log(dataToSet);
    dbConfig.getDB().query("insert into subscribe set ? ", dataToSet, callback);
}

let getSubscription = (criteria, callback) => {
     console.log(criteria);
    let conditions = "";
    criteria.subscribingUserId ? conditions += ` and subscribingUserId = '${criteria.subscribingUserId}'` : true;
    criteria.subscribedUserId ? conditions += ` and subscribedUserId = '${criteria.subscribedUserId}'` : true;
    // criteria.subscriptionStatus ? conditions += ` and subscriptionStatus = '${criteria.subscriptionStatus}'` : true;
    console.log(`SELECT subscriptionId,subscriptionStatus FROM subscribe  WHERE 1 ${conditions} `)
    dbConfig.getDB().query(`SELECT subscriptionId,subscriptionStatus FROM subscribe  WHERE 1 ${conditions} `, callback);

}
let getSubscribeId = (criteria, callback) => {
    // console.log(criteria);
    let conditions = "";
    criteria.subscriptionId ? conditions += ` subscriptionId = '${criteria.subscriptionId}'` : true;
    //console.log(`SELECT subscriptionId FROM subscribe  WHERE  ${conditions} `)
    dbConfig.getDB().query(`SELECT subscriptionId FROM subscribe  WHERE  ${conditions} `, callback);

}

let getSubscriptionStatus = (criteria, callback) => {
    //console.log(criteria);
    let conditions = "";
    criteria.subscribingUserId ? conditions += ` subscribingUserId = '${criteria.subscribingUserId}'` : true;
    criteria.subscribedUserId ? conditions += ` and subscribedUserId = '${criteria.subscribedUserId}'` : true;
    // criteria.subscriptionStatus ? conditions += ` and subscriptionStatus = '${criteria.subscriptionStatus}'` : true;
    //console.log(`SELECT subscriptionId FROM subscribe  WHERE  ${conditions} `)
    dbConfig.getDB().query(`SELECT subscriptionStatus FROM subscribe  WHERE  ${conditions} `, callback);

}
let updateSubscription = (criteria, dataToSet, callback) => {
    // console.log(criteria);
    let conditions = "";
    let setData = ""
    criteria.subscribingUserId ? conditions += ` and subscribingUserId = '${criteria.subscribingUserId}'` : true;
    criteria.subscribedUserId ? conditions += ` and subscribedUserId = '${criteria.subscribedUserId}'` : true;
    dataToSet.subscriptionStatus ? setData += `  subscriptionStatus = '${dataToSet.subscriptionStatus}'` : true;
    console.log(`UPDATE subscribe SET ${setData} where 1 ${conditions}`)
    dbConfig.getDB().query(`UPDATE subscribe SET ${setData} where 1 ${conditions}`, callback);


}



let getUserByEmail = (criteria, callback) => {
    let conditions = "";
    criteria.email ? conditions += ` and email = '${criteria.email}'` : true;


    dbConfig.getDB().query(`select userId,userName,fullName,email from user where 1 ${conditions}`, callback);
}

let addInvitation = (dataToSet, callback) => {

    dbConfig.getDB().query(`insert into invite_user set ? `, dataToSet, callback);
}
let checkInvitation = (criteria, callback) => {
    let conditions = "";
    criteria.invitedEmailAddress ? conditions += `invitedEmailAddress = '${criteria.invitedEmailAddress}'` : true;
    criteria.invitingUserId ? conditions += `and  invitingUserId = '${criteria.invitingUserId}'` : true;
    dbConfig.getDB().query(`SELECT invitingId FROM invite_user  WHERE  ${conditions} `, callback);
}

let getPost = (criteria, callback) => {
    let conditions = "";

    criteria.userId ? conditions += `post.userId = '${criteria.userId}'` : true;

    dbConfig.getDB().query(`select post.userId,user.userName,user.fullNAme,user_info.userImage,post.postId,post.repostId,post.text,post.postImage,post.hashTag,post.parentId,post.createdOn, (select count(likeId) from like_post where postId=post.postId) as likeCounter, (select count(post2.postId) from post as post2 where post2.repostId=post.postId) as repostCounter,(select count(post3.postId) from post as post3 where post3.parentId=post.postId) as replyCounter from post LEFT JOIN user ON post.userId = user.userId LEFT JOIN user_info ON post.userId = user_info.userId WHERE ${conditions} ORDER BY post.createdOn DESC` , (err,dbData)=>{
        let  loopArray = async function(dbData) {
            let  result = [];
            for(let item = 0; item < dbData.length;  item++ ){
               await getSubData(dbData[item]).then(res=>{
                   result.push(res)
               })
               
            }
            callback(null, result)
          
       }
         
        async function getSubData(data) {
            return new Promise((resolve,reject)=>{
                if((data.repostId && data.repostId != 0) || (data.parentId && data.parentId!=0)){
                    let conditions = ""
                    if(data.repostId && data.repostId != 0 ){
                        conditions = 'postId='+data.repostId
                    }else{
                        conditions = 'postId='+data.parentId
                    }
                    dbConfig.getDB().query(`SELECT distinct user.userName as parentUserName, user.fullNAme as parentFullName,  post.text parentText, post.postImage as parentPostImage
                    FROM post
                    LEFT JOIN user ON post.userId = user.userId
                    WHERE ${conditions}
                   `,(suberr,subData)=>{
                    if(suberr){ reject(suberr) ; return;}
                        data.parentUserName = subData[0].parentUserName
                        data.parentFullName = subData[0].parentFullName
                        data.parentText = subData[0].parentText
                        data.parentPostImage = subData[0].parentPostImage
                        resolve(data)
                   })  
                }else{
                    resolve(data)
                }
   
            })
       }
       loopArray(dbData)
    });
    //console.log(`select postId,repostId,parentId, userId,text,postImage,hashTag from post where 1 ${conditions}`)
}
// list of followers /
let getfollowerList = (criteria, callback) => {
    let conditions = "";

    criteria.userId ? conditions += `followedId = '${criteria.userId}'` : true;

    dbConfig.getDB().query(`select f.followerId,u.fullName,ui.userImage,ui.bio,u.userName,f.followStatus as isFollowed from follower_followed as f left join user as u on userId=followerId left join user_info as ui on u.userId=ui.userId where ${conditions}`, callback);
   // console.log(`select f.followerId,u.fullName ,f.followStatus as isFollowed from follower_followed as f left join user as u on userId=followerId where 1 ${conditions}`)
}
// list of followeds /
let getfollowedList = (criteria, callback) => {
    let conditions = "";

    criteria.userId ? conditions += `followerId = '${criteria.userId}'` : true;

    dbConfig.getDB().query(`select f.followedId,u.fullName,ui.userImage,ui.bio,u.userName ,f.followStatus as isFollowed from follower_followed as f left join user as u on u.userId=f.followedId left join user_info as ui on u.userId=ui.userId where ${conditions}`, callback);
    //console.log(`select f.followerId,u.fullName from follower_followed as f left join user as u on userId=followerId where 1 ${conditions}`)
}
let getPosts = (criteria, callback) => {
    let conditions = "";
    criteria.postId ? conditions += ` and postId = '${criteria.postId}'` : true;
    criteria.userId ? conditions += ` and userId = '${criteria.userId}'` : true;


    dbConfig.getDB().query(`select postId,userId,text,postImage,hashTag from post where 1 ${conditions}`, callback);
}

let replyPost = (dataToSet, callback) => {
    dbConfig.getDB().query("insert into post set ? ", dataToSet, callback);
}
let repost = (dataToSet, callback) => {
    dbConfig.getDB().query("insert into post set ? ", dataToSet, callback);
}

let getblockId = (criteria, callback) => {
    let conditions = "";

    conditions += (` blockingUserId = '${criteria.blockingUserId}' AND blockedUserId = '${criteria.blockedUserId}' AND blockStatus = 'true'`);
    //console.log(conditions)

    dbConfig.getDB().query(`select blockId from block_users where ${conditions}`, callback);
    //console.log(`select blockId from block_users where ${conditions}`)
}

let blockedUser = (dataToSet, callback) => {
    // console.log(dataToSet);
    dbConfig.getDB().query("insert into block_users set ? ", dataToSet, callback);
}
let getBlockedUser = (criteria, callback) => {
    let conditions = "";

    criteria.userId ? conditions += `and userId = '${criteria.userId}'` : true;

    dbConfig.getDB().query(`select fullName from user where 1 ${conditions}`, callback);
    //console.log(`SELECT count(userId) FROM like WHERE postId 1 ${conditions}`)
}

//list of blocked User /
let getblockUserList = (criteria, callback) => {
    let conditions = "";

    criteria.userId ? conditions += `blockingUserId = '${criteria.userId}'` : true;

    dbConfig.getDB().query(`select b.blockedUserId as userId,u.fullName,ui.userImage,ui.bio,u.userName from block_users as b left join user as u on userId=blockedUserId LEFT JOIN user_info as ui ON u.userId=ui.userId where ${conditions}`, callback);
    console.log(`select b.blockedUserId as userId,u.fullName,ui.userImage,ui.bio from block_users as b left join user as u on userId=blockedUserId where ${conditions}`)
}
let deletePost = (criteria, callback) => {
    let conditions = "";
    criteria.postId ? conditions += ` and postId = '${criteria.postId}'` : true;
    criteria.userId ? conditions += ` and userId = '${criteria.userId}'` : true;
    conditions += ` or repostId = '${criteria.postId}'` ; 
    conditions += ` or parentId = '${criteria.postId}'` ;
    dbConfig.getDB().query(`DELETE FROM post WHERE  1 ${conditions}`, (err,data)=>{
        if(err){ callback(err,data); return;}
        dbConfig.getDB().query(`DELETE FROM like_post WHERE  postId = '${criteria.postId}' `,callback);
    });
   // dbConfig.getDB().query(`UPDATE post SET postStatus = 'false'  WHERE  1 ${conditions}`, callback);
}

// Post for Profile /
let getPostForProfile = (criteria, callback) => {
    let conditions = "";

    criteria.userId ? conditions += `post.userId = '${criteria.userId}'` : true;
    dbConfig.getDB().query(`select post.userId,user.userName,user.fullName,user_info.userImage,post.postId,post.repostId,post.text,post.postImage,post.hashTag,post.parentId,post.createdOn, (select count(likeId) from like_post where postId=post.postId) as likeCounter, (select count(post2.postId) from post as post2 where post2.repostId=post.postId) as repostCounter,(select count(post3.postId) from post as post3 where post3.parentId=post.postId) as replyCounter from post LEFT JOIN user ON post.userId = user.userId LEFT JOIN user_info ON post.userId = user_info.userId WHERE ${conditions} ORDER BY post.createdOn DESC`, (err,dbData)=>{
        if(err) {callback(err,dbData) ; return;}
        let  loopArray = async function(dbData) {
            let  result = [];
            for(let item = 0; item < dbData.length;  item++ ){
               await getSubData(dbData[item]).then(res=>{
                   result.push(res)
               })
               
            }
            callback(null, result)
          
       }
         
        async function getSubData(data) {
            return new Promise((resolve,reject)=>{
                if((data.repostId && data.repostId != 0) || (data.parentId && data.parentId!=0)){
                    let conditions = ""
                    if(data.repostId && data.repostId != 0 ){
                        conditions = 'postId='+data.repostId
                    } else if(data.parentId && data.parentId != 0 ){
                        conditions = 'postId='+data.parentId
                    }
                    else{
                        resolve(data)
                    }
                    dbConfig.getDB().query(`SELECT distinct 
                    user.userName as parentUserName, 
                    user.fullNAme as parentFullName,
                    post.text parentText, 
                    post.postImage as parentPostImage,
                    user_info.userImage as parentUserImage

                    ,(SELECT COUNT( likeId ) 
                    FROM like_post
                    WHERE postId = post.postId
                    ) AS parentLikeCounter

                    ,(SELECT COUNT( post2.postId ) 
                    FROM post AS post2
                    WHERE post2.repostId = post.postId
                    ) AS parentRepostCounter
                    
                    ,(SELECT COUNT( post3.postId ) 
                    FROM post AS post3
                    WHERE post3.parentId = post.postId
                    ) AS parentReplyCounter 
                    

                    FROM post
                    LEFT JOIN user ON post.userId = user.userId
                    LEFT JOIN user_info ON post.userId = user_info.userId
                    WHERE  ${conditions}
                   `,(suberr,subData)=>{
                    if(suberr){ reject(suberr) ; return;}
                        data.parentUserName = subData[0].parentUserName
                        data.parentFullName = subData[0].parentFullName
                        data.parentUserImage = subData[0].parentUserImage
                        data.parentText = subData[0].parentText
                        data.parentPostImage = subData[0].parentPostImage
                        data.parentLikeCounter = subData[0].parentLikeCounter
                        data.parentRepostCounter = subData[0].parentRepostCounter
                        data.parentReplyCounter = subData[0].parentReplyCounter
                        resolve(data)
                   })  
                }else{
                    resolve(data)
                }
   
            })
       }
       loopArray(dbData)
    });
}

let getfollow = (criteria, callback) => {
    // console.log(criteria);
    let conditions = "";
    criteria.followerId ? conditions += ` followerId = '${criteria.followerId}'` : true;
    criteria.followedId ? conditions += ` and followedId = '${criteria.followedId}'` : true;
    dbConfig.getDB().query(`SELECT * FROM follower_followed  WHERE  ${conditions} `, callback);

}


let updateFollowStatus = (criteria, dataToSet, callback) => {
    // console.log(criteria);
    let conditions = "";
    let setData = ""
    criteria.followerId ? conditions += ` and followerId = '${criteria.followerId}'` : true;
    criteria.followedId ? conditions += ` and followedId = '${criteria.followedId}'` : true;
    dataToSet.followStatus ? setData += `  followStatus = '${dataToSet.followStatus}'` : true;
    console.log(`UPDATE follower_followed SET ${setData} where 1 ${conditions}`)
    dbConfig.getDB().query(`UPDATE follower_followed SET ${setData} where 1 ${conditions}`, callback);


}


let getfollowStatus = (criteria, callback) => {
    let conditions = "";
    criteria.followerId ? conditions += `and followerId = '${criteria.followerId}'` : true;
    criteria.followedId ? conditions += `and followedId = '${criteria.followedId}'` : true;
    dbConfig.getDB().query(`SELECT followStatus FROM follower_followed WHERE 1  ${conditions}`, callback);
}


let getUserLikes = (criteria, callback) => {
    let conditions = "";

    criteria.userId ? conditions += ` and l.userId = '${criteria.userId}'` : true;
    //console.log(conditions, "dfda")
    dbConfig.getDB().query(`SELECT l.postId,user.userName, user.fullName, user_info.userImage,post.repostId, post.text, post.postImage, post.hashTag, post.parentId, post.createdOn, (
    
    SELECT COUNT( likeId ) 
    FROM like_post
    WHERE postId = post.postId
    ) AS likeCounter, (
    
    SELECT COUNT( post2.postId ) 
    FROM post AS post2
    WHERE post2.repostId = post.postId
    ) AS repostCounter, (
    
    SELECT COUNT( post3.postId ) 
    FROM post AS post3
    WHERE post3.parentId = post.postId
    ) AS replyCounter 
    
    FROM like_post as l 
    left join post on l.postId = post.postId 
    LEFT JOIN user ON post.userId = user.userId
    LEFT JOIN user_info ON post.userId = user_info.userId
    WHERE 1 ${conditions}
    
    ORDER BY post.createdOn DESC`, (err, dbData)=>{
        if(err) {callback(err,dbData) ; return;}
            //console.log(dbData)
            let  loopArray = async function(dbData) {
                let  result = [];
                for(let item = 0; item < dbData.length;  item++ ){
                await getSubData(dbData[item]).then(res=>{
                    result.push(res)
                })
                                
                }
               
                callback(null, result)
            
        }
        async function getSubData(data) {
            return new Promise((resolve,reject)=>{
               if(data.repostId != 0 || data.parentId!=0){
                    let conditions = ""
                    if(data.repostId != 0 ){
                        conditions = 'postId='+data.repostId
                    }else{
                        conditions = 'postId='+data.parentId
                    }
                    dbConfig.getDB().query(`SELECT distinct user.userName as parentUserName, user.fullName as parentFullName, user_info.userImage as parentUserImage, post.text parentText, post.postImage as parentPostImage, post.createdOn as parentCreatedOn 
                    ,(SELECT COUNT( likeId ) 
                    FROM like_post
                    WHERE postId = post.postId
                    ) AS parentLikeCounter

                    ,(SELECT COUNT( post2.postId ) 
                    FROM post AS post2
                    WHERE post2.repostId = post.postId
                    ) AS parentRepostCounter
                    
                    ,(SELECT COUNT( post3.postId ) 
                    FROM post AS post3
                    WHERE post3.parentId = post.postId
                    ) AS parentReplyCounter 

                    FROM post
                    LEFT JOIN user ON post.userId = user.userId
                    LEFT JOIN user_info ON post.userId = user_info.userId
                    WHERE  ${conditions}
                   `,(suberr,subData)=>{
                        if(suberr){ reject(suberr) ; return;}
                        data.parentUserName = subData[0].parentUserName
                        data.parentFullName = subData[0].parentFullName
                        data.parentUserImage = subData[0].parentUserImage   
                        data.parentText      = subData[0].parentText
                        data.parentPostImage = subData[0].parentPostImage
                        data.parentLikeCounter = subData[0].parentLikeCounter
                        data.parentRepostCounter = subData[0].parentRepostCounter
                        data.parentReplyCounter = subData[0].parentReplyCounter
                        data.parentCreatedOn = subData[0].parentCreatedOn
                        resolve(data)
                   })  
                }else{
                      resolve(data)
                }
   
            })
       }
       loopArray(dbData)
    })
    
}


let getpostLikes = (criteria, callback) => {
    let conditions = "";

    criteria.postId ? conditions += ` and l.postId = '${criteria.postId}'` : true;

    dbConfig.getDB().query(`SELECT l.userId,user.userName ,user.fullName, ui.bio, ui.userImage FROM like_post as l 
    LEFT JOIN user ON l.userId = user.userId
    LEFT JOIN user_info as ui ON user.userId = ui.userId
    WHERE 1  ${conditions} `, callback);
    //console.log(`SELECT count(userId) FROM like WHERE postId 1 ${conditions}`)
}

/*get unblock user */
let getblock = (criteria, callback) => {
    // console.log(criteria);
    let conditions = "";
    criteria.blockingUserId ? conditions += ` blockingUserId = '${criteria.blockingUserId}'` : true;
    criteria.blockedUserId ? conditions += ` and blockedUserId = '${criteria.blockedUserId}'` : true;
    dbConfig.getDB().query(`SELECT * FROM block_users  WHERE  ${conditions} `, callback);

}
/**update block status */
let updateblockStatus = (criteria, dataToSet, callback) => {
    // console.log(criteria);
    let conditions = "";
    let setData = ""
    criteria.blockingUserId ? conditions += ` blockingUserId = '${criteria.blockingUserId}'` : true;
    criteria.blockedUserId ? conditions += ` and blockedUserId = '${criteria.blockedUserId}'` : true;
    dataToSet.blockStatus ? setData += `  blockStatus = '${dataToSet.blockStatus}'` : true;
    console.log(`UPDATE block_users SET ${setData} where ${conditions}`)
    dbConfig.getDB().query(`UPDATE block_users SET ${setData} where ${conditions}`, callback);

}

module.exports = {
    createUser: createUser,
    createUserInfo: createUserInfo,
    createPost: createPost,
    getUsers: getUsers,
    getUsersLogin: getUsersLogin,
    updateUser: updateUser,
    updateUserInfo: updateUserInfo,
    getUserInfo: getUserInfo,
    getUserByUserName: getUserByUserName,
    getHashTag: getHashTag,
    getUserPost: getUserPost,
    getFollower: getFollower,
    getFollowed: getFollowed,
    getUser: getUser,
    getLike: getLike,
    getfollowId: getfollowId,
    addFollower: addFollower,
    getAddFollower: getAddFollower,
    getUserProfile: getUserProfile,
    getProfile: getProfile,
    likePost: likePost,
    updateUserDevicetoken: updateUserDevicetoken,
    notification: notification,
    getUserFeedCoin: getUserFeedCoin,
    subscribe: subscribe,
    addSubscribe: addSubscribe,
    getSubscription: getSubscription,
    getSubscribeId: getSubscribeId,
    updateSubscription: updateSubscription,
    getSubscriptionStatus: getSubscriptionStatus,
    getUserByEmail: getUserByEmail,
    addInvitation: addInvitation,
    checkInvitation: checkInvitation,
    getPost: getPost,
    getfollowerList: getfollowerList,
    getfollowedList: getfollowedList,
    getPosts: getPosts,
    replyPost: replyPost,
    repost: repost,
    getblockId: getblockId,
    blockedUser: blockedUser,
    getBlockedUser: getBlockedUser,
    getblockUserList: getblockUserList,
    deletePost: deletePost,
    getPostForProfile: getPostForProfile,
    getBlocked: getBlocked,
    getfollow: getfollow,
    updateFollowStatus: updateFollowStatus,
    getfollowStatus: getfollowStatus,
    getUserLikes: getUserLikes,
    getpostLikes: getpostLikes,
    getUserPassword: getUserPassword,
    updateUserPassword: updateUserPassword,
    getPostReplies:getPostReplies,
    getUserDeviceToken:getUserDeviceToken,
    notificationList:notificationList,
    updateNotification:updateNotification,
    updateLikePost:updateLikePost,
    getblock:getblock,
    updateblockStatus:updateblockStatus,
    getNotificationsPreferences:getNotificationsPreferences,
    addNotificationsPreferences:addNotificationsPreferences,
    updateNotificationsPreferences:updateNotificationsPreferences,

}
