const mongoose = require("mongoose")

const gigsSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    timeline:{
        type:String,
        required:true

    },
    status:{
        type:String,
        required:true
    },
    influencerid:{
        type: mongoose.Schema.Types.ObjectId,   
        required:true
    },
    created:{
         type: Date,
         default: Date.now
    }
})

const Gigs = module.exports = mongoose.model('Gigs',gigsSchema)