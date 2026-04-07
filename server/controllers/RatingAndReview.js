const RatingAndReview=require('../models/RatingAndReview')
const Course=require('../models/Course')

const mongoose = require("mongoose");

// exports.createRating = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { rating, review, courseId } = req.body;
// 
//     const courseDetails = await Course.findOne({
//       _id: courseId,
//       studentsEnrolled: { $elemMatch: { $eq: userId } },
//     });

//     if (!courseDetails) {
//       return res.status(404).json({
//         success: false,
//         message: "Student is not enrolled in this course",
//       });
//     }

//     const alreadyReviewed = await RatingAndReview.findOne({
//       user: userId,
//       course: courseId,
//     });
// 
//     if (alreadyReviewed) {
// //       return res.status(403).json({
//         success: false,
//         message: "Course already reviewed by user",
//       });
//     }

//     const ratingReview = await RatingAndReview.create({
//       rating,
//       review,
//       course: courseId,
//       user: userId,
//     });

//     await Course.findByIdAndUpdate(courseId, {
//       $push: {
//         ratingsAndReviews: ratingReview,
//       },
//     });
//     await courseDetails.save();

//     return res.status(201).json({
//       success: true,
//       message: "Rating and review created successfully",
//       ratingsAndReviews: ratingReview,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// exports.getAverageRating = async (req, res) => {
//   try {
//     const courseId = req.body.courseId;

//     const result = await RatingAndReview.aggregate([
//       {
//         $match: {
//           course: new mongoose.Types.ObjectId(courseId),
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           averageRating: { $avg: "$rating" },
//         },
//       },
//     ]);

//     if (result.length > 0) {
//       return res.status(200).json({
//         success: true,
//         averageRating: result[0].averageRating,
//       });
//     }

//     return res.status(200).json({ success: true, averageRating: 0 });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to retrieve the rating for the course",
//       error: error.message,
//     });
//   }
// };

// exports.getAllRatingReview = async (req, res) => {
//   try {
//     const allReviews = await RatingAndReview.find({})
//       .sort({ rating: "desc" })
//       .populate({
//         path: "user",
//         select: "firstName lastName email image",
//       })
//       .populate({
//         path: "course",
//         select: "courseName",
//       })
//       .exec();

//     res.status(200).json({
//       success: true,
//       data: allReviews,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to retrieve the rating and review for the course",
//       error: error.message,
//     });
//   }
// };

// createRating
exports.createRating=async(req,res)=>
    {
        try
        {
            // Rating,Review dena hai  user ko kisi particular course ke liye
            // so we need Rating,Review,userId,courseId

            // 1>get user id
                const userId=req.user.id

            // 2>fetch data rating,review,courseId from req.body
                const{rating,review,courseId}=req.body

            // 3>check if user is enrolled or not
            const courseDetails=await Course.findOne(
                {
                  _id:courseId,
                //   courseID ke basis pr course ko find out kro

                studentsEnrolled:{$elemMatch:{$eq:userId}}//$eq is equal operator
                // "Course" model me "studentsEnrolled" property me jo element hai vo "userId" se match ho rha hai ya nhi ye check hoga
                // agr "userId" "studentsEnrolled" ke element se match krr rha hai mtlb vo user already enrolled hai course me
                }
              )
             if(!courseDetails)
                {
                    return res.status(404).json({
                        success:false,
                        message:"Student is not enrolled in the course",
                    })
                }

            // 4>check if user have already not reviewed the course
            // ekk User ekk hi baar course ka review de skta hai
            const alreadyReviewed=await RatingAndReview.findOne(
                {
                    user:userId,
                    course:courseId ,
                    // vo RatingAndReview document find krr ke layega jiska "user" property "userId" se match hojaye
                    // aur "course" property "courseId" se match ho jaye 
                }
            )
            if(alreadyReviewed)
                {
                    return res.status(403).json({
                        success:false,
                        message:"Course is already Reviewed by the user"
                    })
                }

            // 5>create rating and review=> ye RatingAndReview model me store hoga
            const ratingReview=await RatingAndReview.create({
                rating,review,course:courseId,user:userId
                // RatingAndReview model me rating,review,"course" property me"courseId" aur
                // "user" property me "userId" insert krr rhe hai
            })
          
            // 6>update the Course with the created rating and review
            // abb rating and review kisi course ke liye kiya hai to oos Course  ko created rating and review se update kro
           const updatedCourseDetails=await Course.findByIdAndUpdate(
                {
                    _id:courseId
                    // jo bhi Course document ka "_id" ,"courseId" se match krega vo "Course" document find 
                    // krr ke lao
                },
                {
                    $push:{
                        ratingsAndReviews:ratingReview._id
                        // push into the Course model's `ratingsAndReviews` array (matches schema)
                    }
                },
                {
                    new:true
                }
            )
            console.log(`updatedCourseDetails of createRating() => ${updatedCourseDetails}`);
            //  return response
            return res.status(200).json({
               success:true,
               message:"Rating And Review created successfully",
               ratingReview
            })


        }
        catch(error)
        {
            console.log(`Error in createRating() => ${error}`);
            return res.status(500).json({
                success:false,
                message:error.message
            })
        }
    }

// getAverageRating
exports.getAverageRating=async(req,res)=>
    {
        try
        {
            // 1>fetch courseId from req.body
            const courseId=req.body.courseId;
            // 2>calculate average rating
            const result=await RatingAndReview.aggregate([
                // here aggregate function will return an array
                {
                    $match:{
                        course:new mongoose.Types.ObjectId(courseId),
                        // "RatingAndReview" model ka vo document find krr ke layega 
                        // jiska "course" property ka element "courseId" se match krr rha hai this matching
                       // is done with the help of "courseId"
                      // abb aise multiple "RatingAndReview" document aayenge jiske "course" property me "courseId" pdaa hoga

                        // new mongoose.Types.ObjectId(courseId) will covert "courseId" which is String into an Object
                    }
                },
                {
                    // abb bcoz of $match jitne bhi multiple RatingAndReview document aayenge
                    // oon sbhi ko group krna hai using $group
                    $group:{
                        _id:null,
                        // _id:null means jitne bhi RatingAndReview ke document aaye the oon sbhi ko ekk single group me wrap krr diya
                        averageRating:{$avg:"$rating"}// This calculates the average rating for all documents 
                        // that match the previous $match condition. 
                        // The $avg operator computes the average of the specified field ("rating" property of RatingAndReview model in this case).
                    }
                }
            ]
            //  yha aggregate() array return krr rha hai jiske andr bss ekk hi value hoga 
            // and that value is "averageRating" which is present at 0th index
        )
            

            // 3>return rating
            if(result.length>0)
                {
                    return res.status(200).json({
                        success:true,
                        averageRating:result[0].averageRating,
                        // aggregate function is returning an array therefore return value of 
                        // aggregate function will be present at 0th index of "result" array
                    })
                }

                // if no rating and review exists
                return res.status(200).json({
                    success:true,
                    message:"Average rating is 0, and no ratings given",
                    averageRating:0
                })

        }
        catch(error)
        {
           console.log(`Error in getAverageRating() => ${error}`);
           return res.status(500).json({
            success:false,
            message:error.message
           })
        }
    }


// getAllRatingAndReviews
// different User  different rating and reviews denge too vo saare 
// rating and reviews nikalne ke liye we will use getAllRating() 

exports.getAllRating=async(req,res)=>
    {
        try 
        {
            const allReviews = await RatingAndReview.find({})//saara RatingAndReview ke document ya data ootha krr layega
      .sort({ rating: "desc" })//"RatingAndReview" model me jo "rating" property hai jo number type ka data rkhta hai oose descending order me sort kro
      .populate({
        path: "user",//RatingAndReview model ka jo user property hai oose populate krega mtlb "User" document show kro instead of objectId
        select: "firstName lastName email image",//jo "User" document ya model populate krne ke baad 
        // show hoga oos "User" document ka bss "firstName,lastName ,email,image"show hoga UI prr after populate 
        // other than "firstName lastName email image" iske alawa doosre property show nhi hoga User document ya model ka
      })
      .populate({
        path: "course",//RatingAndReview ke "course" property ko populate kro jisme "Course" model ya document pda hai
        select: "courseName",//"Course" model ya document ka sirf "courseName" property show hoga on the UI after populate
      })
      .exec();

   return res.status(200).json({
      success: true,
      message:"All rating and reviews fetched successfully",
      data: allReviews,
    });

        }
        catch(error)
        {
            console.log(`Error in getAllRating() => ${error}`);
          return res.status(500).json({
            success:false,
            message:error.message
          })
        }
    }