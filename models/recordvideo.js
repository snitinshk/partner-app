const mongoose = require("mongoose")

const recordvideosSchema = new mongoose.Schema({
    influencerid:{
        type: mongoose.Schema.Types.ObjectId,  
        required:true
    },
    videoBookSessionid:{
        type: mongoose.Schema.Types.ObjectId,  
        required:true

    },
    created:{
         type: Date,
         default: Date.now
    }
})

const Recordvideos = module.exports = mongoose.model('Recordvideos',recordvideosSchema)