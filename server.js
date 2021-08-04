const express = require("express")
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const path = require('path') 
app.use(cookieParser());
require('dotenv').config()
app.set('view engine','ejs')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY) 
const Influencer = require('./models/influencer.js')
const Gig = require('./models/gig.js')
const Order = require('./models/orders.js')
const sgMail = require('@sendgrid/mail')
// ADD THIS
var cors = require('cors');
app.use(cors());

app.use(
    bodyParser.json({
      // We need the raw body to verify webhook signatures.
      // Let's compute it only when hitting the Stripe webhook endpoint.
      verify: function(req, res, buf) {
        if (req.originalUrl.startsWith("/webhook")) {
          req.rawBody = buf.toString();
        }
      }
    })
  );

app.use(express.urlencoded({extended:false}))
app.use(express.static(__dirname + '/views'))
app.use(bodyParser.urlencoded({extended:false})) 
app.use(bodyParser.json())
app.use("/",require('./routes/dashboard'))


mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true,useFindAndModify: false},()=>{
    console.log("Connected to Mongoose")
})
app.get('/landingpage',(req,res)=>{
    res.render('landingpage')
})

//for testing
app.get('/placeorder/:id',async(req,res)=>{
    const gig = await Gig.findById(req.params.id)
    const influencer = await Influencer.findById(gig.influencerid)
    const influencerName = influencer.firstname + " " + influencer.lastname
    res.render('placeorder',{gigprice: gig.price, gigid: gig._id, influencerid:gig.influencerid, key: process.env.STRIPE_PUBLISHABLE_KEY, gigtitle: gig.title, influencername: influencerName, orderamount: gig.price})
})

app.get("/public-key", (req, res) => {
    res.send({ publicKey: process.env.STRIPE_PUBLISHABLE_KEY});
  });
  
  app.post("/payment_intents", async (req, res) => {
    let { currency, items } = req.body;
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: items[0]["price"],
        currency
      });
      return res.status(200).json(paymentIntent);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  
// A webhook to receive events sent from Stripe
// You can listen for specific events
// This webhook endpoint is listening for a payment_intent.succeeded event
app.post("/webhook", async (req, res) => {
    // Check if webhook signing is configured.
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event;
      let signature = req.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(
          req.rawBody,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`);
        return res.sendStatus(400);
      }
      data = event.data;
      eventType = event.type;
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // we can retrieve the event data directly from the request body.
      data = req.body.data;
      eventType = req.body.type;
    }
  
    if (eventType === "payment_intent.succeeded") {
      console.log("💰Your user provided payment details!");
      // Fulfill any orders or e-mail receipts
      res.sendStatus(200);
    }
  });


app.listen(5000,()=>{
    console.log("Listening to 5000")
})

