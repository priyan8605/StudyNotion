const mongoose=require("mongoose");
const User=require('./User')
const ratingAndReview=new mongoose.Schema({
     user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
     },
     rating:{
        type:Number,
        required:true,
     },
     review:{
        type:String,
        required:true,
     },
     course: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Course",
      index: true,//apply index on "course" field
    },
})
module.exports=mongoose.model("RatingAndReview",ratingAndReview)