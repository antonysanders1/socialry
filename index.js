const functions = require("firebase-functions");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.urlencoded({extends: true}));
app.use(express.json());
app.use(cors());

//SendGrid Config
//const sgMail = require('@sendgrid/mail');
//const { firestore } = require("firebase-admin");
//const SENDGRID_KEY = functions.config().sendgrid.key
//sgMail.setApiKey(SENDGRID_KEY)
//Stripe config

const stripe = require('stripe')(functions.config().stripe.key)
const stripe_test = require('stripe')(functions.config().stripe.testkey)

app.post('/payment-test', cors(), async(req, res) => {
    // const stripe = require('stripe')(functions.config().stripe.testpubkey)
    let { amount, id, description, email} = req.body
    
    try {
        const payment = await stripe_test.paymentIntents.create({
            payment_method_types: ['card'],
            amount,
            currency: "usd",
            description,
            payment_method: id,
            confirm: true,
            // customer: email,
            // application_fee_amount: fee,
            receipt_email: email,
            // transfer_data: {
            //     destination: proStripeId,
            //   },
            //   on_behalf_of: proStripeId,
        })
        console.log("Payment:", payment)
        res.json({
            message: "Payment Succesful",
            success: true
        })
    } catch (error) {
        console.log("Payment 2 Pro Error:", error)
        res.json({
            message: "Payment Failed",
            success: false
        })


    }
})

exports.app = functions.runWith({timeoutSeconds:30, memory:'1GB'}).https.onRequest(app);

//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
