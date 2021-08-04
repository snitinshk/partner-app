const mongoose = require("mongoose")

exports.schema = mongoose.model('forum',{
    title: { type: String,text: true },
    category: { type: String },
    subCategory: { type: String },
    description: { type: String },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'influencer'
    },
    createdAt:{
        type: Date
    },
    updatedAt:{
        type: Date
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
    ]
})
exports.model = mongoose.model('forum')