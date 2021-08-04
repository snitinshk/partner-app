const mongoose = require("mongoose")

exports.schema = mongoose.model('comment',{
    comment: {type:String},
    postId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'forum' 
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'influencer'
    },
    activity:[
        {
            activityType:{
                type:String,
                enum : ['UPVOTED','DOWNVOTED','DELETED'],
            },
            createdBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'influencer'
            },
            createdAt:{
                type: Date
            },
            updatedAt:{
                type: Date
            }
        }
    ],
    flags:[
        {
            reason: {type:String},
            createdBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'influencer'
            },
            createdAt:{
                type: Date
            },
            updatedAt:{
                type: Date
            }
        }
    ],
    createdAt:{
        type: Date
    },
    updatedAt:{
        type: Date
    }
})
exports.model = mongoose.model('comment')
