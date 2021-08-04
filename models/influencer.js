const mongoose = require("mongoose")
const path = require('path')
const imagebasepath = 'influencers'
const bcrypt = require("bcrypt")
const sgMail = require('@sendgrid/mail')
const Email = require('../routes/email')
const crypto = require('crypto')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'mail.privateemail.com',
  port: 465,
  secure: true,
  auth: {
    user: '*****',
    pass: '******'
  }
});
let from = "**********"

const influencerSchema = new mongoose.Schema({
    firstname:{
        type:String,
    },
    lastname:{
        type:String,
    },
    email:{
        type:String
    },
    password:{
        type:String,
    },
    phone:{
      type:String,

    },
    address:{
      type:String,

    },
    city:{
      type:String,

    },
    country:{
      type:String,

    },
    postalcode:{
      type:Number,

    },
    aboutme:{
      type: String,

    },
    experience:{
      type: String,
    },
    languages:{
      type: String,

    },
    profilepic:{
      type: String,
    },
    revenue:{
      type:String,
      default:"0"
    },
    numberofsessions:{
      type:Number,
      default:0

    },
    numberofsessionsshowedup:{
      type:Number,
      default:0

    },
    languages:[],
    created:{
      type: Date,
      default: Date.now
    },
    status:{
      type:Boolean,
      default:false
    },
    verifyid:{
      type:String
    },
    resetPasswordToken:{
      type:String
    },
    resetExpiration:{
      type:Date
    }

})

const Influencer = module.exports = mongoose.model('Influencer',influencerSchema)

module.exports.getInstuctorById = function(id,cb){

    Influencer.findById(id,cb)
  }
module.exports.getInfluencerByEmail = function(email,cb){
  
    Influencer.findOne({email:email},cb)
  }
  
module.exports.createUser = function(newUser,cb){
    bcrypt.genSalt(10, function(err,salt){
  
     bcrypt.hash(newUser.password,salt,function(err,hash){
       if(err) throw err
       newUser.password = hash
       let verifyid = crypto.randomBytes(20).toString('hex');
       newUser.verifyid = verifyid
       newUser.save(cb)
       let mailOptions = {
        from: from,
        to: newUser.email,
        subject: 'CodePartner: Please verify your email '+newUser.firstname,
        html : Email.sendverification(newUser,verifyid),
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      //  const msg = {
      //   to:  newUser.email, // Change to your recipient
      //   from: 'noreply@codepartner.me', // Change to your verified sender
      //   subject: 'CodePartner: Please verify your email '+newUser.firstname,
      //   html: Email.sendverification(newUser,verifyid),
      // }
  
      // sgMail
      //   .send(msg)
      //   .then(() => {
      //     console.log('Email sent')
      //   })
      //   .catch((error) => {
      //     console.error(error)
      //     if (error.response) {
      //       // Extract error msg
      //       const {message, code, response} = error;
      
      //       // Extract response msg
      //       const {headers, body} = response;
      
      //       console.error(body);
      //     }
      //   })
  
     })
  
    })
  }

  
module.exports.comparePassword = function(myPassword,hash,cb){
  
    bcrypt.compare(myPassword,hash,function(err,isMatch){
      if(err) throw err
      cb(null,isMatch)
  
    })
  }
  
  module.exports.imagebasepath = imagebasepath