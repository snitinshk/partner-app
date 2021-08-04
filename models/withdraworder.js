const mongoose = require("mongoose")

const withdraworderSchema = new mongoose.Schema({
 
    price:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"pending",
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

const Withdraworder = module.exports = mongoose.model('Withdraworder',withdraworderSchema)