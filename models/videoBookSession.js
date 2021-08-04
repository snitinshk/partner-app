const mongoose = require("mongoose")

const videoBookSessionSchema = new mongoose.Schema({
    userWhoMadeVideo:{
        type: mongoose.Schema.Types.ObjectId,   
    },
    userWhoJoinVideo:{
        type: mongoose.Schema.Types.ObjectId,   
    },
    videoMeetingLink:{
        type:String
    },
    videoDate:{
        type:String
    },
    videoDateObject:{
        type:Date
    },
    newVideoDateObject:{
        type:Date
    },
    videoTime:{
        type:String
    },
    videoStatus:{
        type:String
    },
    incrementuserWhoJoinVideo:{
        type: Boolean,   
        default:false,
    },
    incrementuserWhoMadeVideo:{
        type: Boolean,  
        default:false, 
    },
    created:{
         type: Date,
         default: Date.now
    },
    userWhoMadeVideoFirstName:{
        type:String
    },
    userWhoMadeVideoLastName:{
        type:String
    },
    userWhoJoinVideoFirstName:{
        type:String
    },
    userWhoJoinVideoLastName:{
        type:String
    },
    listSessionId: {
        type: mongoose.Schema.Types.ObjectId
    }
})

const VideoBookSession = module.exports = mongoose.model('videoBookSession',videoBookSessionSchema)