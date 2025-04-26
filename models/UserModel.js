const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username : {type:String, required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    role:{type:String,enum:['user','seller','admin'],default:'user'},
    mobile:{type:String}
})

module.exports = mongoose.model('User',userSchema)