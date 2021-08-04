const mongoose = require("mongoose")

exports.schema = mongoose.model('category',{
    categoryName: {type:String},
    subCategory:[
        {
            subCategoryName:{type:String},
        }
    ],
    createdAt:{
        type: Date
    },
    updatedAt:{
        type: Date
    }
})
exports.model = mongoose.model('category')
