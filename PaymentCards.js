const express= require('express')
const mongoose= require('mongoose')
const app =express()

mongoose.connect('mongodb://127.0.0.1/LastMile',() =>{
    console.log('Connection to DB successful..');
});

const paymentcards= new mongoose.Schema({

    customerId:  mongoose.Schema.Types.ObjectId,
    cards: Array,
});

const PaymentCards= mongoose.model('PaymentCards', paymentcards);

PaymentCards.create({cards:[]}, (err)=>{
    if(err) console.log("Error"); 
});
PaymentCards.create({cards:[]}, (err)=>{
    if(err) console.log("Error"); 
});

