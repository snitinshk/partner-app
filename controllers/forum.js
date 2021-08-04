
const forum = require('../models/forum')
const notification = require('../models/notification')
const influencerComment = require('../models/comment')
const categoryModal = require('../models/category')
const Influencer = require('../models/influencer')
const helper = require('../helper/helper')
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId;
//DATABASE_URL = mongodb+srv://shivam:shivam246336@devshivam.l4tii.mongodb.net/devshivam?retryWrites=true&w=majority
/**
 * get top 10 post from db
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 */
exports.showPost = async function (req, resp, next) {
    const userId = req.user.data._id 
    const user = await Influencer.findById(userId);
    const {search,caegoryType,subCategoryType} = req.query;
    /**
     * Pagination cases for post
     */
    const page = (req.query.page)?req.query.page:1;
    const limit = (req.query.limit)?req.query.limit:5;
    const skip = ((page-1)*limit)
    /**
     * Pagination cases for post
     */

    const post = forum.model;
    const pipeline = [
        {
            $lookup:{
                from:'comments',
                localField: '_id',
                foreignField: 'postId',
                as:'comments'
            }
        },
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
                title:1, category:1, subCategory:1, 
                description:1,
                createdAt:1,
                adminId:"$admin._id",
                admin:{ $concat: ["$admin.firstname", " ", "$admin.lastname" ] },
                adminPic:"$admin.profilepic",
                totalComments:{
                    $size:"$comments"
                },
                totalFlags: {$size: "$flags"},
                isDownvoted: { 
                    $size: {
                        $ifNull: [{"$filter": {
                            "input": "$activity",
                            "as": "result",
                            "cond": {
                                "$and":[
                                    {"$eq": ["$$result.activityType", 'DOWNVOTED']},
                                    {"$eq": ["$$result.createdBy", ObjectId(userId)]}
                                ]
                            }
                        }}, [] ]
                    }
                    
                },
                isUpvoted: { 
                    $size: {
                        $ifNull:[{
                            "$filter": {
                                "input": "$activity",
                                "as": "result",
                                "cond": {
                                    "$and":[
                                        {"$eq": ["$$result.activityType", 'UPVOTED']},
                                        {"$eq": ["$$result.createdBy", ObjectId(userId)]}
                                    ]
                                }
                            }
                        },[]]
                    }
                    
                },
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
            
        },
        {
            $sort : { 
                createdAt : -1,
                updatedAt : -1
            }
        }
    ]
    if(caegoryType){
        pipeline.unshift({
            $match:{
                category:caegoryType
            }
        })
    }
    if(subCategoryType){
        pipeline.unshift({
            $match:{
                subCategory:subCategoryType
            }
        })
    }
    if(search){
        pipeline.unshift({ $match: { title: new RegExp(search, "gi") } })
    }

    const filter = {search:search,caegoryType:caegoryType,subCategoryType:subCategoryType};
    const totalMatched = await post.aggregate(pipeline);
    pipeline.push({ $skip: skip }, { $limit: limit })
    const allPost = await post.aggregate(pipeline);
    const categoryObj = categoryModal.model;
    const categories = await categoryObj.find({},'categoryName');

    if(page == 1){
        resp.render('index',{page:"partials/_forum",filter:filter,
        user:user,allPost:allPost,
        totalPost:totalMatched.length,
        helper:helper,categories:categories})
    }else{
        resp.json({code:200,data:allPost});
    }
    
}

exports.addPost = async function (req, resp, next) {
    
    try {
        let {title,category,subCategory,description} = req.body;

        const post = new forum.schema({
            title: title,
            category: category,
            subCategory: subCategory,
            description: description,
            createdBy: req.user.data._id,
            createdAt: new Date(),
            updatedAt: new Date()
        })
        post.save()
        resp.redirect('/forum');
    } catch (error) {
        console.log(error);
    }
}
exports.postDetail = async function (req, resp, next) {
    const userId = req.user.data._id 
    const user = await Influencer.findById(userId)
    const postId = (req.params.id)?ObjectId(req.params.id):null;
    /**
     * Pagination cases for comment
     */
    const page = (req.query.page)?req.query.page:1;
    const limit = (req.query.limit)?req.query.limit:5;
    const skip = ((page-1)*limit)
    /**
    * Pagination cases for comment
    */
    const post = forum.model;

    const pipeline = [
        {
            $lookup:{
                from:'comments',
                localField: '_id',
                foreignField: 'postId',
                as:'comments'
            }
        },
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
                title:1, category:1, subCategory:1, 
                description:1,
                createdAt:1,
                adminId:"$admin._id",
                admin:{ $concat: ["$admin.firstname", " ", "$admin.lastname" ] },
                adminPic:"$admin.profilepic",
                totalComments: {$size: "$comments"},
                totalFlags: {$size: "$flags"},
                isAlreadyReported: { 
                    $size: {
                        $ifNull: [{"$filter": {
                            "input": "$flags",
                            "as": "result",
                            "cond": {
                                "$eq": ["$$result.createdBy", ObjectId(userId)]
                            }
                        }}, [] ]
                    }
                    
                },
                isDownvoted: { 
                    $size: {
                        $ifNull: [{"$filter": {
                            "input": "$activity",
                            "as": "result",
                            "cond": {
                                "$and":[
                                    {"$eq": ["$$result.activityType", 'DOWNVOTED']},
                                    {"$eq": ["$$result.createdBy", ObjectId(userId)]}
                                ]
                            }
                        }}, [] ]
                    }
                    
                },
                isUpvoted: { 
                    $size: {
                        $ifNull:[{
                            "$filter": {
                                "input": "$activity",
                                "as": "result",
                                "cond": {
                                    "$and":[
                                        {"$eq": ["$$result.activityType", 'UPVOTED']},
                                        {"$eq": ["$$result.createdBy", ObjectId(userId)]}
                                    ]
                                }
                            }
                        },[]]
                    }
                    
                },
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
            
        },
        {
            $match:{
                _id:postId
            }
        }
    ];
    
    const comments = influencerComment.model;
    const userComments = await comments.aggregate([
        {
            $match:{
                postId:postId
            }
        },
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
                comment:1,
                createdAt:1,
                adminId:"$admin._id",
                admin:{ $concat: ["$admin.firstname", " ", "$admin.lastname" ] },
                adminPic:"$admin.profilepic",
                totalFlags: {$size: "$flags"},
                isAlreadyReported: { 
                    $size: {
                        $ifNull: [{"$filter": {
                            "input": "$flags",
                            "as": "result",
                            "cond": {
                                "$eq": ["$$result.createdBy", ObjectId(userId)]
                            }
                        }}, [] ]
                    }
                    
                },
                isDownvoted: { 
                    $size: {
                        $ifNull: [{"$filter": {
                            "input": "$activity",
                            "as": "result",
                            "cond": {
                                "$and":[
                                    {"$eq": ["$$result.activityType", 'DOWNVOTED']},
                                    {"$eq": ["$$result.createdBy", ObjectId(userId)]}
                                ]
                            }
                        }}, [] ]
                    }
                    
                },
                isUpvoted: { 
                    $size: {
                        $ifNull:[{
                            "$filter": {
                                "input": "$activity",
                                "as": "result",
                                "cond": {
                                    "$and":[
                                        {"$eq": ["$$result.activityType", 'UPVOTED']},
                                        {"$eq": ["$$result.createdBy", ObjectId(userId)]}
                                    ]
                                }
                            }
                        },[]]
                    }
                    
                },
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
        },
        
        {
            $sort : { 
                createdAt : -1
            }
        },
        { $skip: skip }, { $limit: limit }
    ])
    if(page == 1){
        /**
         * Pipeline for post is put here to it dont get pulled with pagination of comment
         */
        const postDetail = await post.aggregate(pipeline)
        resp.render('index',{page:"partials/_forumdetail",user:user,postDetail:postDetail[0],userComments:userComments,helper:helper})
    }else{
        resp.json({code:200,data:userComments});
    }
}
/**
 *  Add new comment to a post
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 */
exports.addComment = async function (req, resp, next) {

    try {
        const userId = req.user.data._id;
        // const userId = '60b34b63bd99ae8860cc5d4a'
        const user = await Influencer.findById(userId)
        let {comment,postId} = req.body;
        
        const commentData = {
            comment: comment,
            postId:postId,
            createdBy: userId,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        
        const commentObj =  new influencerComment.schema(commentData)
        const commentInfo = await commentObj.save();
        
        /**
         * Create a new notification for the post
         */
        const post = forum.model;
        const postInfo = await post.findOne({"_id": postId},{ createdBy: 1});
        /**
         * Check if comment and post are not from same user
         */
        if(commentInfo && userId != postInfo.createdBy){
            const commentuser = user.firstname+' '+user.lastname
            const notificationObj = new notification.schema({
                title: commentuser+" has commented on your post in forum",
                postId: postId,
                createdBy:userId,
                receiverId:postInfo.createdBy,
                createdAt: new Date(),
                updatedAt: new Date()
            })
            notificationObj.save();
        }
        /**
         * Update the post updated date
         */
        updatePostUpdateDate(postId)
        
        const commentReturnData = {
            commentInfo:commentInfo,
            user:user
        }
        resp.json({code:200,data:commentHtml(commentReturnData)})
    } catch (error) {
        resp.json({code:201,data:{}})
    }
    
}

/**
 * Upvote downvote a post
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 */
exports.addActivity = async function (req, resp, next) {
    try {
        const userId = req.user.data._id;
        // const userId = '60b34b63bd99ae8860cc5d4a'
        const user = await Influencer.findById(userId)
        let {activity,postId} = req.body;

        const post = forum.model;
        
        /**
         * Check if user already downvoted/upvoted then we can updated his new response else create a new
         */
        let userActivity = await post.findOne({_id: postId,"activity.createdBy": userId},{ activity: 1,createdBy: 1});
        if(userActivity && userActivity.activity.length){
            await post.updateOne(
                {"_id": postId,"activity.createdBy": userId},
                { $set: { "activity.$.activityType" : activity,"activity.$.updatedAt": new Date()} })
        }else{
            const where = { _id: postId };
            const activityData = {
                activityType: activity, // UPVOTE/DOWNVOTE
                createdBy: userId,
                createdAt: new Date(),
                updatedAt: new Date()
            }
            
            const update = { $push: { activity: activityData  } }
            userActivity = await post.findOneAndUpdate(where, update, {
                new: true,
                "fields": { activity: 1,createdBy: 1}
            });
        }

        const postInfo = await post.findOne({"_id": postId},{ createdBy: 1});
        /**
         * Create a new notification for upvote/downvote
         */
         if(userActivity && activity!='DELETED' && userId != postInfo.createdBy){
            const activeUser = user.firstname+' '+user.lastname
            const notificationObj = new notification.schema({
                title: activeUser+" has "+activity.toLowerCase()+" your post",
                postId: userActivity._id,
                receiverId:userActivity.createdBy,
                createdBy:userId,
                createdAt: new Date(),
                updatedAt: new Date()
            })
            notificationObj.save();
        }
        /**
         * Update the post updated date
         */
        updatePostUpdateDate(postId)

        resp.json({code:200,data:{}});

    } catch (error) {
        resp.json({code:201,data:{}});
    }
    
}
/**
 * Upvote/downvote a comment
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 */

exports.addCommentActivity = async function (req, resp, next) {
    
    try {
        // const userId = "60b34b63bd99ae8860cc5d4a";
        const userId = req.user.data._id;
        const user = await Influencer.findById(userId)
        let {activity,commentId,postId} = req.body;

        const comment = influencerComment.model;
        
        /**
         * Check if user already downvoted/upvoted then we can updated his new response else create a new
         */
        let userActivity = await comment.findOne({"_id": commentId,"activity.createdBy": userId},{ activity: 1,createdBy: 1});
        
        if(userActivity && userActivity.activity.length){
            await comment.updateOne(
                {"_id": commentId,"activity.createdBy": userId},
                { $set: { "activity.$.activityType" : activity,"activity.$.updatedAt": new Date()} }
            )
        }else{
            const where = { _id: commentId };
            const activityData = {
                activityType: activity, // UPVOTE/DOWNVOTE
                createdBy: userId,
                createdAt: new Date(),
                updatedAt: new Date()
            }
            const update = { $push: { activity: activityData  } }
            userActivity = await comment.findOneAndUpdate(where, update, {
                new: true,
                "fields": { activity: 1,createdBy: 1}
            });
        }
        
        const commentInfo = await comment.findOne({"_id": commentId},{ createdBy: 1});
        /**
         * Create a new notification for upvote/downvote
         */
         
         if(userActivity && activity!='DELETED' && userId != commentInfo.createdBy){
            const activeUser = user.firstname+' '+user.lastname
            const notificationObj = new notification.schema({
                title: activeUser+" has "+activity.toLowerCase()+" your comment",
                postId: postId,
                receiverId:userActivity.createdBy,
                createdBy:userId,
                createdAt: new Date(),
                updatedAt: new Date()
            })
            notificationObj.save();
        }
        /**
         * Update the comment updated date
         */
        updateCommentUpdateDate(commentId)
        resp.json({code:200,data:{}});

    } catch (error) {
        resp.json({code:201,data:{}});
    }
    
}
/**
 * Report a post or comment as flag
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 */
exports.addReport = async function (req, resp, next) {
    try {
        const userId = req.user.data._id;
        // const userId = '60b34b63bd99ae8860cc5d4a'
        const user = await Influencer.findById(userId)
        let {reason,postId,commentId} = req.body;
        const reportData = {
            reason: reason, // UPVOTE/DOWNVOTE
            createdBy: userId,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        if(postId){
            const where = { _id: postId };
        
            const post = forum.model;
    
            const update = { $push: { flags: reportData  } }
            const postReport = await post.findOneAndUpdate(where, update, {
                new: true,
                "fields": { _id: 1}
            });
            
            /**
             * Update the post updated date
             */
            updatePostUpdateDate(postId)
        }else{
            const where = { _id: commentId };
            
            const comment = influencerComment.model;
    
            const update = { $push: { flags: reportData  } }
            const commentReport = await comment.findOneAndUpdate(where, update, {
                new: true,
                "fields": { _id: 1}
            });
            /**
             * Update the comment updated date
             */
            updateCommentUpdateDate(commentId)
        }
        resp.json({code:200,data:{}});

    } catch (error) {
        console.log(error)
        res.json({code:201,data:{}});
    }
}
/**
 * Add new Category Dynamically added via postman
 * @param {*} req 
 * @param {*} resp 
 * @param {*} next 
 */
exports.addCategory = async function (req, resp, next) {
    let {category,subCategory1,subCategory2,subCategory3} = req.body
    const categoryObj = new categoryModal.schema({
        categoryName: category,
        subCategory:[{
            subCategoryName:subCategory1
        },{
            subCategoryName:subCategory2
        },{
            subCategoryName:subCategory3
        }],
        createdAt: new Date(),
        updatedAt: new Date()
    })
    const respObj = await categoryObj.save()
    resp.json(respObj);
} 
exports.getSubCategory = async function (req, resp, next) {
    let {id} = req.params
    const categoryObj = categoryModal.model;
    const subCategories = await categoryObj.find({_id:id},'subCategory');
    resp.json(subCategories);
}
/**
 * Update comment update date on activity and flag
 * @param {} commentId 
 */
 const updateCommentUpdateDate = async (commentId)=>{
    const comment = influencerComment.model;
    const where = { _id: commentId };
    const update = { updatedAt: new Date() }
    const respData = await comment.findOneAndUpdate(where, update, {
        new: true,
        "fields": { _id: 1}
    });
    
}

/**
 * Update post update date on comment/activity and flag
 * @param {} postId 
 */
 const updatePostUpdateDate = async (postId)=>{
    const post = forum.model;
    const where = { _id: postId };
    const update = { updatedAt: new Date() }
    const respData = await post.findOneAndUpdate(where, update, {
        new: true,
        "fields": { _id: 1}
    });
    
}

/**
 * Add comment to a post via post detail
 * @param {*} commentData 
 * @returns 
 */
const commentHtml = (commentData)=>{
    var commentId = commentData.commentInfo._id;
    var profilepic = (commentData.user.profilepic)?'/upload/influencers/'+commentData.user.profilepic:'/assets/images/defaultprofilepic.png';
    var adminName = commentData.user.firstname+' '+commentData.user.lastname;
    return `
    <div data-comment-timestamp = "`+new Date(commentData.commentInfo.createdAt).getTime() +`" class="comment-wrap forum-detail-wrap">
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
                    <span>`+commentData.commentInfo.comment+`</span>
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

