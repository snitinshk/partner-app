const mongoose = require("mongoose")

exports.schema = mongoose.model('notification',{
    title: { type: String },
    postId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'forum' 
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'influencer'
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'influencer'
    },
    isReaded:{
        type:Number,
        enum : [0,1],
        default: 0
    },
    createdAt:{
        type: Date
    },
    updatedAt:{
        type: Date
    }
})

exports.model = mongoose.model('notification')