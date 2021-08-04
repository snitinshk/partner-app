const forum = require('../models/forum')
const notification = require('../models/notification')
const influencerComment = require('../models/comment')
const categoryModal = require('../models/category')
const Influencer = require('../models/influencer')
const helper = require('../helper/helper')
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId;

/**
 * Check updated details over comments of a feed
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 */

exports.checkUpdateForComment = async function (req, resp, next) {
    try {
        // const userId = req.user.data._id 
        // const user = await Influencer.findById(userId);
        const {timestamp,postId} = req.query;
        
        const comment = influencerComment.model;
        const pipeline = [
            {
                $project:{
                    _id:1,
                    flags:1,
                    activity:1,
                    postId:1,
                    "timestamp": { "$toLong": "$updatedAt" }
                }
                
            },
            {
                $match:{
                    $and:[
                        {
                            postId: ObjectId(postId)
                        },
                        {
                            timestamp: {$gt: parseInt(timestamp)}
                        }
                    ]
                }
            },
            {
                $project:{
                    totalFlags: {$size: "$flags"},
                    upvotes: { 
                        $size: {
                            $ifNull:[{"$filter": {
                                "input": "$activity",
                                "as": "result",
                                "cond": {
                                    "$eq": ["$$result.activityType", 'UPVOTED']
                                }
                            }},[]]
                        }
                        
                    },
                    downvotes: { 
                        $size: {
                            $ifNull:[{
                                "$filter": {
                                    "input": "$activity",
                                    "as": "result",
                                    "cond": {
                                        "$eq": ["$$result.activityType", 'DOWNVOTED']
                                    }
                                }
                            },[]]
                        }
                        
                    }
                }
            }
            
        ]
        const updatedComment = await comment.aggregate(pipeline);
        resp.json({code:200,data:updatedComment});
    
    } catch (error) {
        console.error(error);
        resp.json({code:201,data:[]});
    }
}

/**
 * Fetch updated details of activity over a post
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 */
exports.checkUpdateForPostDetail = async function (req, resp, next) {
    try {
        // const userId = req.user.data._id 
        // const user = await Influencer.findById(userId);
        const {postId} = req.query;
        
        const post = forum.model;
        const pipeline = [
            {
                $match:{
                    _id: ObjectId(postId)
                }
            },
            {
                $lookup:{
                    from:'comments',
                    localField: '_id',
                    foreignField: 'postId',
                    as:'comments'
                }
            },
            {
                $project:{
                    totalFlags: {$size: "$flags"},
                    totalComments: {$size: "$comments"},
                    upvotes: { 
                        $size: {
                            $ifNull:[{"$filter": {
                                "input": "$activity",
                                "as": "result",
                                "cond": {
                                    "$eq": ["$$result.activityType", 'UPVOTED']
                                }
                            }},[]]
                        }
                        
                    },
                    downvotes: { 
                        $size: {
                            $ifNull:[{
                                "$filter": {
                                    "input": "$activity",
                                    "as": "result",
                                    "cond": {
                                        "$eq": ["$$result.activityType", 'DOWNVOTED']
                                    }
                                }
                            },[]]
                        }
                        
                    }
                }
            }
            
        ]
        const updatedPost = await post.aggregate(pipeline);
        resp.json({code:200,data:updatedPost[0]});
    
    } catch (error) {
        console.error(error);
        resp.json({code:201,data:[]});
    }
}

exports.fetchNewComment = async function (req, resp, next) {
    try {
        const userId = req.user.data._id;
        const {timestamp,postId} = req.query;

        const comment = influencerComment.model;
        const pipeline = [
            {
                $lookup:{
                    from:'influencers',
                    localField: 'createdBy',
                    foreignField: '_id',
                    as:'admin'
                }
            },
            {
                $unwind:'$admin'
            },
            {
                $project:{
                    _id:1,
                    postId:1,
                    admin:{ $concat: ["$admin.firstname", " ", "$admin.lastname" ] },
                    adminPic:"$admin.profilepic",
                    createdAt:1,
                    comment:1,
                    notAdmin: { $ne: [ "$createdBy", ObjectId(userId) ] },
                    "timestamp": { "$toLong": "$createdAt" }
                }
                
            },
            {
                $match:{
                    $and:[
                        {
                            postId: ObjectId(postId)
                        },
                        {
                            notAdmin:true
                        }
                    ]
                }
            }
            
        ]
        
        if(timestamp){
            pipeline.push({ $match: {
                timestamp: {$gt: parseInt(timestamp)}
            }})
        }
        const newComment = await comment.aggregate(pipeline);
        if(newComment.length){
            resp.json({code:200,data:commentHtml(newComment[0])})
        }else{
            resp.json({code:202,data:{}})
        }
    } catch (error) {
        console.log(error)
        resp.json({code:201,data:{}})
    }
}
exports.fetchNewPost = async function (req, resp, next) {
    try {
        // const userId = req.user.data._id 
        // const user = await Influencer.findById(userId);
        const {timestamp} = req.query;
        
        const post = forum.model;
        const pipeline = [
            {
                $project:{
                    _id:1,
                    "timestamp": { "$toLong": "$createdAt" }
                }
                
            },
            {
                $match:{
                    timestamp: {$gt: parseInt(timestamp)}
                }
            }
            
        ]
        const newPost = await post.aggregate(pipeline);
        resp.json({code:200,data:newPost});
    
    } catch (error) {
        resp.json({code:201,data:[]});
    }
}

exports.checkUpdateForPost = async function (req, resp, next) {
    try {
        // const userId = req.user.data._id 
        // const user = await Influencer.findById(userId);
        const {timestamp} = req.query;
        
        const post = forum.model;
        const pipeline = [
            {
                $project:{
                    _id:1,
                    flags:1,
                    activity:1,
                    "timestamp": { "$toLong": "$updatedAt" }
                }
                
            },
            {
                $match:{
                    timestamp: {$gte: parseInt(timestamp)}
                }
            },
            {
                $lookup:{
                    from:'comments',
                    localField: '_id',
                    foreignField: 'postId',
                    as:'comments'
                }
            },
            {
                $project:{
                    totalFlags: {$size: "$flags"},
                    totalComments: {$size: "$comments"},
                    upvotes: { 
                        $size: {
                            $ifNull:[{"$filter": {
                                "input": "$activity",
                                "as": "result",
                                "cond": {
                                    "$eq": ["$$result.activityType", 'UPVOTED']
                                }
                            }},[]]
                        }
                        
                    },
                    downvotes: { 
                        $size: {
                            $ifNull:[{
                                "$filter": {
                                    "input": "$activity",
                                    "as": "result",
                                    "cond": {
                                        "$eq": ["$$result.activityType", 'DOWNVOTED']
                                    }
                                }
                            },[]]
                        }
                        
                    }
                }
            }
            
        ]
        const updatedPost = await post.aggregate(pipeline);
        resp.json({code:200,data:updatedPost});
    
    } catch (error) {
        console.error(error);
        resp.json({code:201,data:[]});
    }
}

const commentHtml = (commentData)=>{

    var commentId = commentData._id;
    var profilepic = (commentData.adminPic)?'/upload/influencers/'+commentData.adminPic:'/assets/images/defaultprofilepic.png';
    var adminName = commentData.admin;
    return `
    <div data-comment-timestamp = "`+new Date(commentData.createdAt).getTime() +`" class="comment-wrap forum-detail-wrap">
        <div class="forum-detail-top ">
            <div class="forum-list-info-wrap ">
                <div class="forum-list-info-profile-pic ">
                    <img src="`+profilepic+`" class="rounded-circle">
                </div>
                <div class="forum-list-info-flag-wrap ">
                    <h4>
                        `+adminName+`
                    </h4>
                </div>
            </div>
            <div class="forum-list-content-wrap ">
                <div class="forum-list-desc">
                    <span>`+commentData.comment+`</span>
                </div>
            </div>
        </div>
        <div class="form-detial-bottom ">
            <div class="form-detial-action-wrap ">
                <div class="forum-detial-action-left">
                    <a href="javascript:void(0)" class="btm-action-btn">
                        <span data-id="`+commentId+`" id="upvote-`+commentId+`" class="mdi mdi-thumb-up upvoteCommentBtn"></span>
                        <span id="upvoteCount-`+commentId+`" class="upvoteCommentCount">0</span>
                    </a>
                    <a href="javascript:void(0)" class="btm-action-btn">
                        <span data-id="`+commentId+`" id="downvote-`+commentId+`" class="mdi mdi-thumb-down downvoteCommentBtn"></span>
                        <span id="downvoteCount-`+commentId+`" class="downvoteCommentCount">0</span>
                    </a>
                    <a href="javascript:void(0)" class="btm-action-btn">
                        <span data-id="`+commentId+`" data-isReported="0" class="mdi mdi-flag reportComment"></span>
                        <span id="flagCount-`+commentId+`">0</span>
                    <a>
                </div>
                <div class="forum-detial-action-right ">
                    <a href="javascript:void(0) " class="btm-action-btn no-cursor ">
                        <span class="mdi mdi-clock grey "></span>Just Now
                    </a>
                </div>
            </div>
        </div>
    </div>`
}