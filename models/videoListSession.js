const mongoose = require("mongoose")

const videoListSessionSchema = new mongoose.Schema({
    userWhoMadeVideo:{
        type: mongoose.Schema.Types.ObjectId,   
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
    videoStatus:{
        type:String
    },
    videoTime:{
        type:String
    },
    created:{
         type: Date,
         default: Date.now
    },
    firstname:{
        type:String
    },
    lastname:{
        type:String
    }
})

const VideoListSession = module.exports = mongoose.model('videoListSession',videoListSessionSchema)