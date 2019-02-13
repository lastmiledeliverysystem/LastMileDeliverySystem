const express= require('express')
const mongoose= require('mongoose')
const app =express()

mongoose.connect('mongodb://127.0.0.1/LastMile',() =>{
    console.log('Connection to DB successful..');
});

const robot= new mongoose.Schema({

});

const Robot= mongoose.model('Robot', robot);

Robot.create( (err)=>{
    if(err) console.log("Error"); 
});

