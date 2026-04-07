const mongoose=require('mongoose')
const CourseProgress=require("./CourseProgress")
const Course=require('./Course')
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        // if lastName=' Rahul' => lastName='Rahul' here space will be gone because of trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,//mtlb email me jo bhi string denge agr oosme space hai to vo apne aap hatt jayega
    },
    password:{
        type:String,
        required:true,
    },
    accountType:{
        type:String,
        enum:["Admin","Student","Instructor"],
        required:true
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Profile",
    },
    courses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    }],
    image:{
        type:String,
        required:true,
    },
    token:{
        type:String,
    },
    resetPasswordExpires:{
        type:Date
    },
    courseProgress:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"CourseProgress",
    }]
})
module.exports=mongoose.model("User",userSchema);