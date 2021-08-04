const forum = require('../models/forum')
const notificationModel = require('../models/notification')
const helper = require('../helper/helper')
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId;

exports.makeRead = async function (req, resp, next) {
    const notification = notificationModel.model;
    await notification.updateOne({_id:req.body.id}, {isReaded:1})
}
exports.fetchAllNotifications = async function (req, resp, next) {
    try {
    const userId = req.user.data._id
    // const userId = '60b34b63bd99ae8860cc5d4a'
    // const user = await Influencer.findById(userId);
    const notification = notificationModel.model;
    const userNotifications = await notification.aggregate([
        {
            $match:{
                receiverId:ObjectId(userId),
                isReaded:0
            }
        },
        {
            $lookup:{
                from:'influencers',
                localField: 'createdBy',
                foreignField: '_id',
                as:'user'
            }
        },
        {
            $unwind:'$user'
        },
        {
            $project:{
                createdAt:1,
                title:1,
                postId:1,

                user:{ $concat: ["$user.firstname", " ", "$user.lastname" ] },
                userPic:"$user.profilepic"
            }
        },
        {
            $sort : { 
                createdAt : -1
            }
        },
        { $skip: 0 }, { $limit: 20 },

    ])
    resp.json({code:200,data:userNotifications})
    
    } catch (error) {
        console.log(error)
        resp.json({code:201,data:[]})
    }
}