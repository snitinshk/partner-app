const express = require("express")
require('dotenv').config()
const router = express()
const multer = require('multer')
const jwt = require('jsonwebtoken')
const Influencer = require('../models/influencer.js')
const categoryModal = require('../models/category');
const Gig = require('../models/gig.js')
const VideoListSession = require('../models/videoListSession.js')
const RecordVideo = require('../models/recordvideo.js')
const VideoBookSession = require('../models/videoBookSession.js')
const Order = require('../models/orders.js')
const Withdraworder = require('../models/withdraworder.js')
const { auth } = require('../middleware/auth')
const path = require('path')
const uploadPath = path.join('views/upload', Influencer.imagebasepath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const { findOneAndUpdate } = require("../models/influencer.js")
const bcrypt = require("bcrypt")
const sgMail = require('@sendgrid/mail')
const Email = require('./email')
const crypto = require('crypto')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
var moment = require('moment');
var momentTimezone = require('moment-timezone');
const videoListSession = require("../models/videoListSession.js")
const nodemailer = require('nodemailer');
const e = require("express");
const forum = require('../controllers/forum')
const autorefresh = require('../controllers/forum-autorefresh')
const notification = require('../controllers/notification')

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

const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

router.get('/', auth, async(req, res) => {
    res.redirect('/gigs')
        //  const userid = req.user.data._id
        //  try{
        //   const pendingorder = await Order.find({influencerid:userid,status:"inprogress"}).countDocuments()
        //   const order = await Order.find({influencerid:userid}).countDocuments()
        //   const revenue = await Influencer.findById(userid)
        //   const latestorders = await Order.find({influencerid:userid,status:{$ne:"rejected"}}).limit(5).sort({_id:-1})
        //   const user = await Influencer.findById(req.user.data._id)

    //   res.render('index',{page:'partials/_dashboard',pendingorders:pendingorder,totalorders:order,totalrevenue:revenue.revenue,latestorders:latestorders,moment: moment,user:user})
    //  }catch(e){
    //    console.log(e)
    //    res.render('index',{page:'partials/_dashboard',message:e,user:user})
    //  }
})

router.get('/500', (req, res) => {
    res.render('500')
})

//for testing
router.get('/orders', auth, (req, res) => {
    res.render('index', { page: "partials/_orders" })
})

router.get('/orderinfo/:id', auth, async(req, res) => {
    try {
        const user = await Influencer.findById(req.user.data._id)
        const order = await Order.findById(req.params.id)
        res.render('index', { page: "partials/_orderinfo", order: order, moment: moment, user: user })
    } catch (e) {
        console.log(e)
        res.render('index', { page: "partials/_orderinfo", message: e, user: req.user.data })
    }

})

router.get('/updatestatus', auth, async(req, res) => {
    try {
        const gigs = await Influencer.find({ status: "false" })
            //   const gs = await Influencer.update( {}, {$set: { status: true, verifyid: null }}, {multi: true}, function(err, result) {
            //      console.log(result);
            //      console.log(err);
            //  });
        console.log(gigs)

    } catch (e) {
        console.log(e)
    }
})

router.get('/updateinf', auth, async(req, res) => {
    try {
        // also need to booked sessions
        const influencer = await Influencer.updateMany({ $set: { numberofsessions: 0, numberofsessionsshowedup: 0 } })
        const video = await VideoBookSession.updateMany({ $set: { incrementuserWhoJoinVideo: false, incrementuserWhoMadeVideo: false } })

        //   for (vid in video){
        //     //console.log(vid._id)
        //     console.log("Date form Picker: " + moment(vid.videoDate).format("YYYY-MM-DD"))
        //     console.log("Time From Picker: " + moment(vid.videoTime, "h:mm A").format("HH:mm:ss"))
        //     console.log(new Date(vid.videoDate+" "+vid.videoTime))
        //     const concatenatedDateTime = moment.tz(moment(vid.videoDate).format("YYYY-MM-DD") + ' ' + moment(vid.videoTime, "h:mm A").format("HH:mm:ss"), 'YYYY-MM-DD HH:mm:ss', "UTC").format()
        //     console.log("Concatenated, date time: " + concatenatedDateTime)
        //     // console.log("New Timezone: " +  req.body.timezone);
        //     // console.log(moment.tz(concatenatedDateTime, req.body.timezone).format())
        //     // const test = moment.tz(concatenatedDateTime, req.body.timezone).format()
        //     // console.log("UTC: " + moment.tz(concatenatedDateTime, req.body.timezone).tz("America/Scoresbysund").format())
        //     // const utcDateTimeConcatenated = moment.tz(concatenatedDateTime, req.body.timezone).utc().format();
        //     // console.log("Final Date time string: " + utcDateTimeConcatenated)
        //     // const utcTime = moment(req.body.time, "h:mm A").format("HH:mm:ss");
        //     // const utcDate = moment(req.body.date).format("YYYY-MM-DD");

        //     const gs = await VideoListSession.update({_id:vid.id}, {$set: { newVideoDateObject: concatenatedDateTime }});
        //     console.log(vid)
        // }
    } catch (e) {
        console.log(e)
    }
})

// router.get('/viewbookedsession',auth,async(req,res)=>{
//   try{
//     const video = await VideoListSession.find({}).sort({created: -1}).limit(50)
//     console.log(video)
//   }catch(e){
//     console.log(e)
//   }
// })

//for testing
router.get('/uploadorder/:id', auth, async(req, res) => {
    try {
        const order = await Order.findById(req.params.id)
        const user = await Influencer.findById(req.user.data._id)

        res.render('index', { page: "partials/_uploadorder", order: order, user: user, moment: moment })
    } catch (e) {
        console.log(e)
        res.render('index', { page: "partials/_uploadorder", user: req.user.data })
    }
})

router.post('/uploadorder/:id', auth, async(req, res) => {
    try {
        const order = await Order.findOneAndUpdate({ _id: req.params.id }, { $set: { completedOrderTime: Date.now(), completedOrder: req.body.completeorderstring, status: "completed" } })
        const influencer = await Influencer.findById(order.influencerid)
        res.status(200).send()

        await Influencer.findOneAndUpdate({ _id: order.influencerid }, { $set: { revenue: (parseFloat(influencer.revenue) + parseFloat(order.price)).toString() } })


        //uploadorderemail

        const msg = {
            to: order.buyeremail,
            from: 'noreply@codepartner.me', // Change to your verified sender
            subject: 'CodePartner: Get your CodePartner order from creator ' + influencer.firstname + ' ' + influencer.lastname,
            html: Email.sendorder(influencer, req.body.completeorderstring),
        }

        sgMail
            .send(msg)
            .then(() => {


            })
            .catch((error) => {
                console.error(error)
                res.redirect('500')
            })


    } catch (err) {
        try {
            console.log(err)
            const user = await Influencer.findById(req.user.data._id)
            res.render('index', { page: 'partials/_uploadorder', message: err, user: user })
        } catch (e) {
            console.log(e)
            res.render('index', { page: 'partials/_uploadorder', message: err, user: req.user.data })
        }
    }
})

router.get('/sharegiginfo/:id', async(req, res) => {
    try {
        const gig = await Gig.findById(req.params.id)
        res.render('sharegigsgiginfo', { gig: gig, moment: moment })
    } catch (e) {
        console.log(e)
        res.render('sharegigsgiginfo', { gig: gig })
    }
})

//for shareable gigis
router.get('/sharegigs/:id', async(req, res) => {
    try {
        const user = await Influencer.findById(req.params.id)
        const gigs = await Gig.find({ influencerid: req.params.id, status: "active" })
        const countgig = await Gig.find({ influencerid: req.params.id, status: "active" }).countDocuments()
        const countorder = await Order.find({ influencerid: req.params.id }).countDocuments()
        res.render('sharegigs', { gigs: gigs, user: user, countgig: countgig, countorder: countorder })
    } catch (e) {
        console.log(e)
        res.render('sharegigs')
    }
})

//for profile
router.get('/profile', auth, async(req, res) => {
    try {
        // const countgig = await Gig.find({influencerid:req.user.data._id,status:{$ne:"deleted"}}).countDocuments()
        // const countorder = await Order.find({influencerid:req.user.data._id}).countDocuments()
        const user = await Influencer.findById(req.user.data._id)
        try {
            userrating = Math.ceil(((user.numberofsessionsshowedup / user.numberofsessions) * 5))

        } catch (e) {
            userrating = "New User"
        }
        res.render('index', { page: 'partials/_profile', user: user, userrating: userrating })
    } catch (e) {
        res.render('index', { page: 'partials/_profile', message: e, user: req.user.data })
    }
})

router.get('/viewprofile/:id', auth, async(req, res) => {
    try {
        // const countgig = await Gig.find({influencerid:req.user.data._id,status:{$ne:"deleted"}}).countDocuments()
        // const countorder = await Order.find({influencerid:req.user.data._id}).countDocuments()
        const profile = await Influencer.findById(req.params.id)
        try {
            profilerating = Math.ceil(((profile.numberofsessionsshowedup / profile.numberofsessions) * 5))

        } catch (e) {
            profilerating = "New User"
        }
        console.log(profilerating)

        const user = await Influencer.findById(req.user.data._id)
        res.render('index', { page: 'partials/_viewprofile', user: user, profile: profile, profilerating: profilerating })
    } catch (e) {
        res.render('index', { page: 'partials/_viewprofile', message: e, user: req.user.data })
    }
})

router.get('/resetpassword', auth, async(req, res) => {
    try {
        const user = await Influencer.findById(req.user.data._id)
        res.render('index', { page: 'partials/_resetpassword', user: user })
    } catch (e) {
        res.render('index', { page: 'partials/_resetpassword', message: e, user: req.user.data })
    }
})

router.get('/newgigform', auth, (req, res) => {
    res.render('index', { page: 'partials/_newgigform', user: req.user.data, message: "", moment: moment, momentTimezone: momentTimezone })
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/gigs', auth, async(req, res) => {
    try {
        let yesterday = new Date();
        const gigs = await VideoListSession.find({ newVideoDateObject: { $gte: yesterday }, videoStatus: "listed" }).sort({ newVideoDateObject: 1 })
        let quality = {}
        for (i in gigs) {
            const influencer = await Influencer.findById(gigs[i].userWhoMadeVideo)
            try {
                quality[gigs[i].userWhoMadeVideo] = Math.ceil(((influencer.numberofsessionsshowedup / influencer.numberofsessions) * 5))
            } catch (e) {
                quality[gigs[i].userWhoMadeVideo] = "New User"
            }
        }

        const user = await Influencer.findById(req.user.data._id)
        res.render('index', { page: 'partials/_gigs', gigs: gigs, user: user, moment: moment, quality: quality, momentTimezone: momentTimezone })
    } catch (e) {
        console.log(e)
        res.render('index', { page: 'partials/_gigs', message: e, user: req.user.data, moment: moment, momentTimezone: momentTimezone })
    }
})

router.get('/pendingsessions', auth, async(req, res) => {
    console.log(req.user.data._id)
    try {
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate());
        yesterday.setHours(0, 0, 0, 0)

        const pendingSession = await VideoBookSession.find({ $and: [{ $or: [{ userWhoJoinVideo: req.user.data._id }, { userWhoMadeVideo: req.user.data._id }] }, { newVideoDateObject: { $gte: yesterday } }, { $or: [{ videoStatus: "pending" }, { videoStatus: "rejected" }] }] }).sort({ newVideoDateObject: 1 })
        console.log(pendingSession)
        const user = await Influencer.findById(req.user.data._id)

        res.render('index', { page: 'partials/_pendingsessions', pendingSessions: pendingSession, user: user })
    } catch (e) {
        console.log(e)
        res.render('index', { page: 'partials/_pendingsessions', message: e, user: req.user.data })
    }
})

router.get('/bookedsessions', auth, async(req, res) => {
    try {
        // { $or: [ { quantity: { $lt: 20 } }, { price: 10 } ] }
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate());
        yesterday.setHours(0, 0, 0, 0)

        const bookedSession = await VideoBookSession.find({ $and: [{ $or: [{ userWhoJoinVideo: req.user.data._id }, { userWhoMadeVideo: req.user.data._id }] }, { newVideoDateObject: { $gte: yesterday } }, { videoStatus: "accepted" }] }).sort({ newVideoDateObject: 1 })
        const user = await Influencer.findById(req.user.data._id)

        res.render('index', { page: 'partials/_sessions', sessions: bookedSession, user: user })
    } catch (e) {
        console.log(e)
        res.render('index', { page: 'partials/_sessions', message: e, user: req.user.data })
    }
})

router.get('/session/:sessionid/:userid', auth, async(req, res) => {
    try {
        /* const videoList = new VideoListSession({
    userWhoMadeVideo:req.user.data._id,
    videoDate: req.body.date,
    newVideoDateObject:new Date(req.body.date),
    videoTime: req.body.time,
    firstname:req.user.data.firstname,
    lastname:req.user.data.lastname,
    videoStatus: "listed"
   })
   try{
    const newVideoList = await videoList.save() */
        const bookedSession = await VideoBookSession.findById(req.params.sessionid);
        const date = new Date()
            // console.log(date)
            // console.log(bookedSession.newVideoDateObject)

        let diff = date - bookedSession.newVideoDateObject

        diff = Math.floor((diff / 1000) / 60);
        let flag = 0
        console.log(req.user.data._id)
        console.log(bookedSession.userWhoMadeVideo)
        if (bookedSession.userWhoMadeVideo == req.user.data._id) {
            flag = 1
        }
        if (flag === 0) {
            if (diff <= 10 && diff >= -15 && bookedSession.incrementuserWhoJoinVideo === false) {
                console.log(diff)
                const influencer = await Influencer.findOneAndUpdate({ _id: req.user.data._id }, { $inc: { numberofsessionsshowedup: 1 } })
                const newsess = await VideoBookSession.findOneAndUpdate({ _id: req.params.sessionid }, { $set: { incrementuserWhoJoinVideo: true } })
            }

        } else if (flag === 1) {
            if (diff <= 10 && diff >= -15 && bookedSession.incrementuserWhoMadeVideo === false) {
                console.log(diff)
                const influencer = await Influencer.findOneAndUpdate({ _id: req.user.data._id }, { $inc: { numberofsessionsshowedup: 1 } })
                const newsess = await VideoBookSession.findOneAndUpdate({ _id: req.params.sessionid }, { $set: { incrementuserWhoMadeVideo: true } })
            }

        }

        const recordVideo = new RecordVideo({
            influencerid: req.user.data._id,
            videoBookSessionid: bookedSession._id
        })

        try {
            const newRecordVideo = await recordVideo.save()
        } catch (e) {

            return res.redirect('/500')

        }
        //console.log(bookedSession)
        res.render('index', { page: 'partials/_video', user: req.user.data, videoMeetingLink: bookedSession.videoMeetingLink, username: req.user.data.firstname + " " + req.user.data.lastname })
    } catch (e) {
        res.render('index', { page: 'partials/_video', message: e, user: req.user.data })
    }
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/giginfo/:id', auth, async(req, res) => {
    try {
        const user = await Influencer.findById(req.user.data._id)
        const gig = await Gig.findById(req.params.id)
        res.render('index', { page: 'partials/_giginfo', gig: gig, user: user, moment: moment })
    } catch (e) {
        res.render('index', { page: 'partials/_giginfo', message: e, user: req.user.data })
    }
})

router.get('/forgotpasswordemail', (req, res) => {
    res.render('forgotpasswordemail')
})

router.get('/forgotpassword/:id', async(req, res) => {
    try {
        Influencer.findOne({ resetPasswordToken: req.params.id, resetExpiration: { $gt: Date.now() } }, function(err, user) {
            if (!user) {
                res.render('Password reset token is invalid or has expired.');
                return res.redirect('/forgotpasswordemail');
            }
            res.render('forgotpassword', {
                influencer: req.user,
                token: req.params.id
            });
        });
    } catch (e) {
        res.render('forgotpassword', { message: e });
    }
})

router.get('/withdraw', auth, async(req, res) => {
    try {
        const user = await Influencer.findById(req.user.data._id)
        res.render('index', { page: 'partials/_withdraw', user: user })
    } catch (e) {
        res.render('index', { page: 'partials/_withdraw', message: e, user: req.user.data })
    }
})

router.post('/withdraw', auth, async(req, res) => {
    try {
        const user = await Influencer.findById(req.user.data._id)
        if (parseFloat(user.revenue) < req.body.price) {
            return res.redirect('/500')
        }
        let newincome = parseFloat(user.revenue) - req.body.price
            // if(newicome<0){
            //   res.redirect('/500')
            // }
        const user2 = await Influencer.findOneAndUpdate({ _id: user._id }, { $set: { revenue: newincome.toString() } })
        const newwithdrawal = new Withdraworder({
            price: req.body.price,
            influencerid: user._id
        })
        const savedWithdrawal = await newwithdrawal.save()
        const msg = {
            to: user.email, // Change to your recipient
            from: 'noreply@codepartner.me', // Change to your verified sender
            subject: 'CodePartner: Withdrawal Request Made',
            html: Email.sendwithdrawal(user, req.body.price, newincome, savedWithdrawal._id),
        }

        sgMail
            .send(msg)
            .then(() => {
                // console.log('Email sent')
            })
            .catch((error) => {
                console.error(error)
            })
        res.redirect('/withdraw')
    } catch (e) {
        res.render('index', { page: 'partials/_withdraw', user: req.data.user, message: e })
    }
})

router.post('/gig/delete/:id', auth, async(req, res) => {
    try {
        const videoListSession = await VideoListSession.findOneAndUpdate({ _id: req.params.id }, { $set: { videoStatus: "deleted" } })
        res.status(200).send()
    } catch (e) {
        res.redirect('gigs')
    }
})

router.post('/gig/inactive/:id', auth, async(req, res) => {
    try {
        const gig = await Gig.findOneAndUpdate({ _id: req.params.id }, { $set: { status: "inactive" } })
        res.status(200).send()
    } catch (e) {
        res.redirect('gigs')
    }
})

router.post('/gig/active/:id', async(req, res) => {
    try {
        const gig = await Gig.findOneAndUpdate({ _id: req.params.id }, { $set: { status: "active" } })
        res.status(200).send()
    } catch (e) {
        res.redirect('gigs')
    }
})

router.post('/forgotpassword/:id', async(req, res) => {
    try {
        Influencer.findOne({ resetPasswordToken: req.params.id, resetExpiration: { $gt: Date.now() } }, function(err, user) {
            if (!user) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('/forgotpasswordemail');
            }
            let passwordupdate;
            bcrypt.genSalt(10, function(err, salt) {

                bcrypt.hash(req.body.password, salt, function(err, hash) {
                    if (err) {
                        console.log(err)
                    }
                    passwordupdate = hash
                    user.password = passwordupdate
                    user.resetExpiration = undefined
                    user.resetPasswordToken = undefined
                    user.save(function(err, user) {
                        if (err) {
                            console.log(err)

                        } else {

                            res.render('login', { success: true, message: 'Password has been reset' })
                        }
                    })
                })
            })
        });
    } catch (e) {
        res.redirect('/500')
    }
})

router.post('/forgotpasswordemail', async(req, res) => {
    try {
        Influencer.getInfluencerByEmail(req.body.email, function(err, influencer) {
            if (err) console.log(err)
            if (!influencer) {
                console.log("error")
                res.render('forgotpasswordemail', { success: false, message: 'Email not found' })
            } else {
                let token = crypto.randomBytes(20).toString('hex');
                influencer.resetPasswordToken = token
                influencer.resetExpiration = Date.now() + 3600000 // 1 hour
                influencer.save()
                let mailOptions = {
                    from: from,
                    to: influencer.email,
                    subject: `CodePartner: Request to reset password`,
                    html: Email.sendreset(influencer, token),
                };

                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });

                res.render('forgotpasswordemail', { message: "Email has been sent" })

            }


        })
    } catch (e) {
        res.redirect('/500')
    }
})

router.post('/newgigform', auth, async(req, res) => {
    console.log("Date form Picker: " + moment(req.body.date).format("YYYY-MM-DD"))
    console.log("Time From Picker: " + moment(req.body.time, "h:mm A").format("HH:mm:ss"))
    console.log(new Date(req.body.date + " " + req.body.time))
    const concatenatedDateTime = moment.tz(moment(req.body.date).format("YYYY-MM-DD") + ' ' + moment(req.body.time, "h:mm A").format("HH:mm:ss"), 'YYYY-MM-DD HH:mm:ss', req.body.timezone).format()
    console.log("Concatenated, date time: " + concatenatedDateTime)
    console.log("New Timezone: " + req.body.timezone);
    console.log(moment.tz(concatenatedDateTime, req.body.timezone).format())
    const test = moment.tz(concatenatedDateTime, req.body.timezone).format()
    console.log("Toronto: " + moment.tz(concatenatedDateTime, req.body.timezone).tz("America/Toronto").format())
    console.log("UTC: " + moment.tz(concatenatedDateTime, req.body.timezone).tz("America/Scoresbysund").format())
    const utcDateTimeConcatenated = moment.tz(concatenatedDateTime, req.body.timezone).utc().format();
    console.log("Final Date time string: " + utcDateTimeConcatenated)
    const utcTime = moment(req.body.time, "h:mm A").format("HH:mm:ss");
    const utcDate = moment(req.body.date).format("YYYY-MM-DD");


    const videoList = new VideoListSession({
        userWhoMadeVideo: req.user.data._id,
        videoDate: utcDate,
        newVideoDateObject: utcDateTimeConcatenated,
        videoTime: utcTime,
        firstname: req.user.data.firstname,
        lastname: req.user.data.lastname,
        videoStatus: "listed"
    })
    try {
        const newVideoList = await videoList.save()
        const user = await Influencer.findById(req.user.data._id)
        res.redirect('/gigs')
    } catch (err) {
        res.render('index', { page: 'partials/_newgigform', message: err, user: req.user.data })
    }
})

router.post('/placeorder/:id', async(req, res) => {
    console.log("PaymentId Number: " + req.body.paymentCompleteId)
    try {
        await stripe.paymentIntents.retrieve(req.body.paymentCompleteId).then(async function(response) {
            if (response.status === 'succeeded') {
                try {
                    const gig = await Gig.findById(req.params.id)
                    const order = new Order({
                        gigid: req.params.id,
                        influencerid: gig.influencerid,
                        buyername: req.body.buyername,
                        buyeremail: req.body.buyeremail,
                        buyerphone: req.body.buyerphone,
                        specialrequest: req.body.specialrequest,
                        price: req.body.price,
                        paymentCompleteId: req.body.paymentCompleteId,
                        status: "new",
                        paid: true
                    })
                    try {
                        // const influencer = await Influencer.findOne({_id:gig.influencerid})
                        const newOrder = await order.save()
                            // let newrevenue = parseFloat(influencer.revenue) + parseFloat(req.body.price)
                            // const influencer2 = await Influencer.findOneAndUpdate({_id:influencer.id},{$set:{revenue:newrevenue.toString()}})

                        const msg = {
                            to: order.buyeremail, // Change to your recipient
                            from: 'noreply@codepartner.me', // Change to your verified sender
                            subject: 'CodePartner: Your order has been placed with ' + influencer.firstname + ' ' + influencer.lastname,
                            html: Email.sendpaymentconfirmation(influencer),
                        }

                        sgMail
                            .send(msg)
                            .then(() => {
                                // console.log('Email sent')
                            })
                            .catch((error) => {
                                console.error(error)
                            })
                        res.status(204).send()
                    } catch (err) {
                        console.log(err)
                            //res.render('placeorder',{message:err})
                    }
                } catch (e) {

                }
            } else {
                console.log("Payment Failed")
                    // Handle unsuccessful, processing, or canceled payments and API errors here
            }
        });
    } catch (e) {
        console.log("Payment Intent not found: " + e)
    }
})

//for testing
router.get('/placeordersuccess', async(req, res) => {
    // const gig = await Gig.findById(req.params.id)
    // const influencer = await Influencer.findById(gig.influencerid)
    // const influencerName = influencer.firstname + " " + influencer.lastname
    // console.log("Influencer Name: " + influencerName)
    res.render('placeordersuccess', { message: "Success" })
})

router.post('/order', auth, async(req, res) => {
    const order = new Order({
        gigid: req.body.gigid,
        influencerid: req.user.data._id,
        buyeremail: req.body.buyeremail,
        buyerphone: req.body.buyerphone,
        buyeraddress: req.body.buyeraddress,
        buyercity: req.body.buyercity,
        buyercountry: req.body.buyercountry,
        status: "new",
        price: req.body.price,
    })
    try {
        const newOrder = await order.save()
        const user = await Influencer.findById(req.user.data._id)
        res.render('order', { message: "Submitted Successfully", user: user })
    } catch (err) {
        res.render('order', { message: err, user: req.user.data })
    }
})

router.post('/register', async(req, res) => {
    //Check if email already exists in the database

    const influencer = new Influencer({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        aboutme: req.body.aboutme,
        languages: req.body.languages
    })

    const influencer2 = await Influencer.findOne({ email: req.body.email })
    if (influencer2) {
        console.log("User already exists")
        res.render('register', { success: false, message: 'Email already exists' })
    } else {
        Influencer.createUser(influencer, function(err, influencer) {
            if (err) {
                console.log(err)
                    //  res.json({success:false,message:'User is not registered'})
                res.render('register', { success: false, message: 'User is not registered' })
            } else {
                //  res.json({success:true,message:'User is registered'})
                const token = jwt.sign({ data: influencer }, process.env.SESSION_SECRET, { expiresIn: 600000 })
                res.cookie('token', token)
                res.redirect('/')
            }
        })
    }
})

router.post('/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password
        //add condition to check if user is already logged in
    Influencer.getInfluencerByEmail(email, function(err, influencer) {
        if (err) console.log(err)
        if (!influencer) {
            return res.render('login', { success: false, message: 'Email not found' })
        }
        Influencer.comparePassword(password, influencer.password, function(err, isMatch) {
            if (err) console.log(err)
            if (isMatch) {
                const token = jwt.sign({ data: influencer }, process.env.SESSION_SECRET, { expiresIn: 600000 })
                res.cookie('token', token)
                    // res.render('index',{page:'partials/_dashboard'})
                res.redirect('/')
            } else {
                res.render('login', { success: false, message: 'Password not found' })
            }
        })
    })
})

router.post('/acceptbooking/:id', auth, async(req, res) => {

    const video = await VideoBookSession.findOneAndUpdate({ _id: req.params.id }, { $set: { videoStatus: "accepted" } })
    const userWhoMadeVideoo = await Influencer.findById(req.body.userWhoMadeVideo)

    // console.log("Date form Picker: " + moment(req.body.date).format("YYYY-MM-DD"))
    // console.log("Time From Picker: " + moment(req.body.time, "h:mm A").format("HH:mm:ss"))
    // console.log("Concatenated, date time: " + moment(moment(req.body.date).format("YYYY-MM-DD") + ' ' + moment(req.body.time, "h:mm A").format("HH:mm:ss"), 'YYYY-MM-DD HH:mm:ss').format())
    // const utcDateTimeConcatenated = moment(moment(req.body.date).format("YYYY-MM-DD") + ' ' + moment(req.body.time, "h:mm A").format("HH:mm:ss"), 'YYYY-MM-DD HH:mm:ss').format();
    // const utcTime = moment(req.body.time, "h:mm A").format("HH:mm:ss");
    // const utcDate = moment(req.body.date).format("YYYY-MM-DD");

    const videoBook = new VideoBookSession({
        userWhoMadeVideo: req.body.userWhoMadeVideo,
        userWhoJoinVideo: req.user.data._id,
        videoDate: req.body.videoDate,
        newVideoDateObject: req.body.newVideoDateObject,
        videoTime: req.body.videoTime,
        userWhoMadeVideoFirstName: userWhoMadeVideoo.firstname,
        userWhoMadeVideoLastName: userWhoMadeVideoo.lastname,
        userWhoJoinVideoFirstName: req.user.data.firstname,
        userWhoJoinVideoLastName: req.user.data.lastname,
        videoMeetingLink: req.body.userWhoMadeVideo + req.user.data._id + (new Date()).getTime(),
        videoStatus: "booked"
    })

    const videoListBooking = await videoListSession.findOneAndUpdate({ _id: req.params.id }, { $set: { videoStatus: "booked" } })
    const influencer1 = await Influencer.findOneAndUpdate({ _id: req.body.userWhoMadeVideo }, { $inc: { numberofsessions: 1 } })
    const influencer2 = await Influencer.findOneAndUpdate({ _id: req.user.data._id }, { $inc: { numberofsessions: 1 } })

    try {
        const newVideoBook = await videoBook.save()

        // const order = await Order.findOneAndUpdate({_id:req.params.id},{$set:{status:"inprogress"}})

        //email for accept
        let mailOptions = {
            from: from,
            to: userWhoMadeVideoo.email,
            subject: `CodePartner: Your timeslot has been booked`,
            html: Email.sendaccept(userWhoMadeVideoo),
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        let mailOptions2 = {
            from: from,
            to: req.user.data.email,
            subject: `CodePartner: Confirmation - You have successfully booked a timeslot`,
            html: Email.sendacceptother(req.user.data),
        };

        transporter.sendMail(mailOptions2, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        res.status(200).send()
    } catch (e) {
        console.log(e)
        res.redirect('/500')
    }
})

router.post('/rejectbooking/:id', auth, async(req, res) => {

    const video = await VideoBookSession.findOneAndUpdate({ _id: req.params.id }, { $set: { videoStatus: "rejected" } })
    const userWhoMadeVideoo = await Influencer.findById(req.body.userWhoMadeVideo)

    try {

        // const order = await Order.findOneAndUpdate({_id:req.params.id},{$set:{status:"inprogress"}})

        console.log(userWhoMadeVideoo.email)

        //email for reject
        let mailOptions = {
            from: from,
            to: video.userWhoMadeVideoo,
            subject: `CodePartner: Uh ho! You just rejected a session`,
            html: Email.sendaccept(userWhoMadeVideoo),
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        let mailOptions2 = {
            from: from,
            to: req.user.data.email,
            subject: `CodePartner: Confirmation - Your partner has rejected your booking`,
            html: Email.sendacceptother(video.userWhoJoinVideo),
        };

        transporter.sendMail(mailOptions2, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        res.status(200).send()
    } catch (e) {
        console.log(e)
        res.redirect('/500')
    }
})

router.post('/pendingbooking/:id', auth, async(req, res) => {

    const userWhoMadeVideoo = await Influencer.findById(req.body.userWhoMadeVideo)

    // console.log("Date form Picker: " + moment(req.body.date).format("YYYY-MM-DD"))
    // console.log("Time From Picker: " + moment(req.body.time, "h:mm A").format("HH:mm:ss"))
    // console.log("Concatenated, date time: " + moment(moment(req.body.date).format("YYYY-MM-DD") + ' ' + moment(req.body.time, "h:mm A").format("HH:mm:ss"), 'YYYY-MM-DD HH:mm:ss').format())
    // const utcDateTimeConcatenated = moment(moment(req.body.date).format("YYYY-MM-DD") + ' ' + moment(req.body.time, "h:mm A").format("HH:mm:ss"), 'YYYY-MM-DD HH:mm:ss').format();
    // const utcTime = moment(req.body.time, "h:mm A").format("HH:mm:ss");
    // const utcDate = moment(req.body.date).format("YYYY-MM-DD");

    const videoBook = new VideoBookSession({
        userWhoMadeVideo: req.body.userWhoMadeVideo,
        userWhoJoinVideo: req.user.data._id,
        videoDate: req.body.videoDate,
        newVideoDateObject: req.body.newVideoDateObject,
        videoTime: req.body.videoTime,
        userWhoMadeVideoFirstName: userWhoMadeVideoo.firstname,
        userWhoMadeVideoLastName: userWhoMadeVideoo.lastname,
        userWhoJoinVideoFirstName: req.user.data.firstname,
        userWhoJoinVideoLastName: req.user.data.lastname,
        videoMeetingLink: req.body.userWhoMadeVideo + req.user.data._id + (new Date()).getTime(),
        listSessionId: req.params.id,
        videoStatus: "pending"
    })

    const videoListBooking = await videoListSession.findOneAndUpdate({ _id: req.params.id }, { $set: { videoStatus: "listed" } })

    try {
        const newVideoBook = await videoBook.save()

        // const order = await Order.findOneAndUpdate({_id:req.params.id},{$set:{status:"inprogress"}})

        console.log(userWhoMadeVideoo.email)

        //email for accept
        let mailOptions = {
            from: from,
            to: userWhoMadeVideoo.email,
            subject: `CodePartner: Your timeslot has been booked`,
            html: Email.sendaccept(userWhoMadeVideoo),
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        let mailOptions2 = {
            from: from,
            to: req.user.data.email,
            subject: `CodePartner: Confirmation - You have successfully booked a timeslot`,
            html: Email.sendacceptother(req.user.data),
        };

        transporter.sendMail(mailOptions2, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        res.status(200).send()
    } catch (e) {
        console.log(e)
        res.redirect('/500')
    }
})

router.get('/verifyemail', async(req, res) => {
    try {
        let accessToken = req.cookies.token
        payload = jwt.verify(accessToken, process.env.SESSION_SECRET)
        req.user = payload
        const influencer = await Influencer.findById(req.user.data._id)
        if (influencer.status === true) {
            res.redirect('/')
        } else {
            res.render('verifyemail')
        }


    } catch (e) {
        res.render('verifyemail')
    }

})

router.get('/verifyemail/:id', async(req, res) => {
    try {
        console.log("here")
        const influencer = await Influencer.findOne({ verifyid: req.params.id })
        if (influencer) {
            const influencer2 = await Influencer.findOneAndUpdate({ _id: influencer._id }, { $set: { status: true, verifyid: null } })
            res.redirect('/login')

        } else {
            res.redirect('/500')
        }
    } catch (e) {
        res.redirect('/500')
    }
})

router.post('/profile', auth, async(req, res) => {
    try {

        //const fileName = req.file != null ? req.file.filename : null
        const user = await Influencer.findOneAndUpdate({ _id: req.user.data._id }, { $set: { phone: req.body.phone, address: req.body.address, city: req.body.city, country: req.body.country, postalcode: req.body.postalcode, aboutme: req.body.aboutme, experience: req.body.experience, languages: req.body.languages } })

        const countgig = await Gig.find({ influencerid: req.user.data._id }).countDocuments()
        const countorder = await Order.find({ influencerid: req.user.data._id }).countDocuments()
        const user1 = await Influencer.findById(req.user.data._id)
        res.redirect('/profile')
    } catch (e) {
        console.log(e)
        res.redirect('/profile')
    }


})

router.post('/uploadphoto', auth, upload.single('image'), async(req, res) => {
    try {
        const fileName = req.file != null ? req.file.filename : null
        console.log(fileName)
        const user = await Influencer.findOneAndUpdate({ _id: req.user.data._id }, { $set: { profilepic: fileName } })
        res.redirect('/profile')

    } catch (e) {
        console.log(e)
        res.redirect('/profile')
    }
})

router.post('/resetpassword', auth, async(req, res) => {
    const password = req.body.password
    Influencer.comparePassword(password, req.user.data.password, function(err, isMatch) {
        if (err) console.log(err)
        if (isMatch) {
            let passwordupdate;
            bcrypt.genSalt(10, function(err, salt) {

                bcrypt.hash(req.body.newpassword, salt, function(err, hash) {
                    if (err) {
                        console.log(err)
                    }
                    passwordupdate = hash
                    Influencer.findByIdAndUpdate(req.user.data._id, passwordupdate, function(err, user) {
                        if (err) {
                            console.log(err)
                        } else {
                            user.password = passwordupdate;
                            user.save(function(err, user) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    const token = jwt.sign({ data: user }, process.env.SESSION_SECRET, { expiresIn: 600000 })
                                    res.cookie('token', token)
                                    res.render('index', { page: "partials/_resetpassword", success: true, message: 'Password has been reset', user: user })
                                }
                            })
                        }
                    });
                })
            })
        } else {
            console.log("error")
            res.render('index', { page: "partials/_resetpassword", success: false, message: 'Password not found', user: req.user.data })
        }
    })
})

router.get('/logout', (req, res) => {
    res.clearCookie("token");
    res.redirect('/login')
})

/**
 * @req request url
 * @res response page
 * redirection handling for forum
 */
router.get('/forum', auth, forum.showPost)

/**
 * @req request url
 * @res response page
 * redirection handling for add forum
 */
router.get('/forum/add-post', auth, async(req, res) => {
    // debugger
    const user = await Influencer.findById(req.user.data._id)
    const categoryObj = categoryModal.model;
    const categories = await categoryObj.find({},'categoryName');
    // console.log(categories);
    res.render('index', { page: "partials/_addforum", user: user,categories:categories })
})


/**
 * @req request url
 * @res response page
 * redirection handling for forum detail
 */
router.get('/forum/post-detail/:id', auth, forum.postDetail)


/**
 * Add new Post to the forum start
 */
router.post('/forum/add-post', auth, forum.addPost)

/**
 * Add new Comment to the forum post start
 */

router.post('/forum/add-comment',auth,forum.addComment)


/**
 * Upvote or downvote a post
 */
router.post('/forum/add-activity',auth, forum.addActivity)

/**
 * Upvote or downvote a comment on post
 */
 router.post('/forum/comment/add-activity',auth, forum.addCommentActivity)

 /**
 * report a post or comment
 */
  router.put('/forum/report',auth, forum.addReport)
/**
 * Add new category to DB
 */
router.post('/addcategory', forum.addCategory)
/**
 * Fetch new Subcategory
 */
router.get('/get-subcategory/:id',auth, forum.getSubCategory) 
/**
 * Get notification corresponding to the user
 */
router.get('/notification/get-new',auth,notification.fetchAllNotifications)
/**
 * Mark a notification as read
 */
router.put('/notification/read',notification.makeRead)
/**
 * Check if new feed exist on feed list screen
 */
router.get('/forum/new-feed',auth,autorefresh.fetchNewPost)
/**
 * Checks for update in feeds on feed list screen
 */
router.get('/forum/check-feedupdate',auth,autorefresh.checkUpdateForPost)
/**
 * Check if a feed has updated comments,upvotes etc for feed detail screen.
 */
router.get('/forum/check-feedupdate-detail',autorefresh.checkUpdateForPostDetail)
/**
 * Check for new comments
 */
router.get('/forum/new-comments',auth,autorefresh.fetchNewComment)

router.get('/forum/check-commentupdate',autorefresh.checkUpdateForComment)


module.exports = router