const express= require('express')
const mongoose= require('mongoose')
const app =express()

mongoose.connect('mongodb://127.0.0.1/LastMile',() =>{
    console.log('Connection to DB successful..');
});

const userinterest= new mongoose.Schema({

    customerId: mongoose.Schema.Types.ObjectId,
    favorite: mongoose.Schema.Types.document,
    wishlist: [{
        item: mongoose.Schema.Types.document,   
    }],


});

const UserInterest= mongoose.model('UserInterest', userinterest);

UserInterest.create({favorite:"blah", wishlist:[{item:'blah'}]}, (err)=>{
    if(err) console.log("Error"); 
});

