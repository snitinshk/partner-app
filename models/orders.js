const mongoose = require("mongoose")

const ordersSchema = new mongoose.Schema({
    gigid:{
        type: mongoose.Schema.Types.ObjectId,   
    },
    influencerid:{
        type: mongoose.Schema.Types.ObjectId,   
    },
    buyername:{
        type:String
    },
    buyeremail:{
        type:String
    },
    buyerphone:{
        type:String
    },
    paid:{
        type:Boolean,
        default:false
    },
    buyercity:{
        type:String
    },
    status:{
        type:String
    },
    price:{
        type:String
    },
    specialrequest:{
        type:String
    },
    created:{
         type: Date,
         default: Date.now
    },
    completedOrder:{
        type: String
    },
    completedOrderTime:{
        type: Date
    },
    paymentCompleteId:{
        type: String
    }
})

const Orders = module.exports = mongoose.model('Orders',ordersSchema)