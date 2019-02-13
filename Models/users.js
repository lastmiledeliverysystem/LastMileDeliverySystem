const mongoose = require ('mongoose');
require('mongoose-type-email');


const users = new mongoose.Schema({
  email:{ type:mongoose.SchemaTypes.Email, required:true},
  password: 
  {type: String , 
  required: true,
  match: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/
  },
  permission: [{
    id: {type:String, required: false},
    role: {type:String, required: true},
  }]

});
const Users = mongoose.model('Users',users);

Users.create({email:'rawan@yahoo.com',password: '123mA',
permission:[{id:'',role:'customer'}]}, (err)=> {
  if (err) console.log("error");
});

module.exports = Users; 

