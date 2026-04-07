const mongoose=require('mongoose')
const Course=require('./Course')
const SubSection=require('./SubSection')


const courseProgress = new mongoose.Schema({
  courseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  completedVideos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
    },
  ],
})

module.exports = mongoose.model("courseProgress", courseProgress)
// const courseProgress=new mongoose.Schema({
//    courseID:{
//     type:mongoose.Schema.Types.ObjectId,
//     ref:"Course",
//    },
//    completedVideos:[{
//     type:mongoose.Schema.Types.ObjectId,
//     ref:"SubSection"
//    }]
// })
// module.exports=mongoose.model("CourseProgress",courseProgress);