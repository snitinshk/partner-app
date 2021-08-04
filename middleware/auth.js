
require("dotenv").config();
const jwt = require('jsonwebtoken')
const Influencer = require('../models/influencer.js')
exports.auth = async function(req, res, next){
    let accessToken = req.cookies.token

    //if there is no token stored in cookies, the request is unauthorized
    if (!accessToken){
       return res.redirect('/landingpage')
    }

    let payload
    try{
        //use the jwt.verify method to verify the access token
        //throws an error if the token has expired or has a invalid signature
        payload = jwt.verify(accessToken, process.env.SESSION_SECRET)
        req.user = payload
        const influencer = await Influencer.findById(req.user.data._id)
        if(influencer.status===false){
            res.redirect('/verifyemail')
        }
        next()
    }
    catch(e){
        //if an error occured return request unauthorized error
        res.redirect('/login')
    }
   
}