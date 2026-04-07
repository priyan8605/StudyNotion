// jbb bhi koi SignUp krta hai user to oos time ekk nakli Profile bnn
// rha hota hai (see Auth.js controller==>exports.signup=()=>{ ... const profileDetails=await Profile.create()})
// jha prr hrr ek field me null store kiya tha

const Profile=require('../models/Profile')
const User=require('../models/User')
const {uploadImageToCloudinary}=require('../utils/imageUploader')
const CourseProgress = require("../models/CourseProgress");
const { convertSecondsToDuration } = require("../utils/SecToDuration");
const Course = require("../models/Course");


// we only need to update Profile and no need to create it as it already have been created

exports.updateProfile=async(req,res)=>  
{
    try
    {
    //   agr User logged in hai to decoded token "decode" me(see "auth.js middleware login()  const payload") user ka id aa hii rha hoga "Auth.js controllers se"
    // token jo ki decoded hai i.e "decode"(auth.js middleware) isme user id hai and "decode"
    // ko hum requset me bhej hi rhe hai "req.user=decode in auth.js middleware"
    // so user id will be alrady present in req.body

    // 1>fetch data
    const {dateOfBirth="",about="",contactNumber,gender}=req.body;
    // agrr dateOfBirth ya about req.body me se aa rha hai to oose lo nhi to by default oose empty String maaan lo

    // 2>fetch userId
    const id=req.user.id;
    // req.user=decode  =>auth.js models
    // const payload={id:user._id} ==>Auth.js controllers

    // 3>Perform validation
    if(!contactNumber||!id)
    {
        return res.status(401).json({
            success:false,
            message:"All fields are required"
        })
    }

    // 4>find already created Profile
    const userDetails=await User.findById(id);//will find the user with help of user id coming from request
    // abb user hum find krr liya and to abb hume user ke andr Profile id mil jayega jo ki user
    // ke additionalDetails property me pda hua hai
    const profileId=userDetails.additionalDetails;//find profile id
    // abb  profileId mil gya so profile ka poora ka poora data bhi hum nikal ke laa skte hai
    const profileDetails=await Profile.findById(profileId);
    // or=> const profileDetails=await Profile.findById(userDetails.additionalDetails)

    // 5>update already created Profile
    profileDetails.dateOfBirth=dateOfBirth;
    profileDetails.about=about;
    profileDetails.gender=gender;
    profileDetails.contactNumber=contactNumber;
    // abb Profile ka object bna pda hai already bss hum profile ke details update kiye abhi to
    // abb in updated profileDetails ko save krenge
    await profileDetails.save();

    // 6>return response
    return res.status(200).json({
        success:true,
        message:"Profile updated successfully",
        profileDetails
    })

    }
    catch(error)
    {
        console.log(`Error in updateProfile()=> ${error}`);
        return res.status(500).json({
            success:false,
            message:"can't update Profile",
            error:error.message,
        })
    }
}


// deleteAccount
exports.deleteAccount=async(req,res)=>
{
    try
    {
        // agr huume koi account delete krna hai to hume oos account ki id pta honi chahiye
        // and user logged in hai to hum ooski id nikal skte hai

        // 1>get id 
           const id=req.user.id;
        // 2>perform validation
        const userDetails=await User.findById({_id:id})
        if(!userDetails)
        {
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        // 3>delete associated Profile or additionalDetails of user
        // aisa nhi ho skta ki user delete ho jaye aur ooske additionalDetails rhh jaye
        // isiliye pahle additionalDetails or Profile delete krr denge fir User ko delte krr denge
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails})
        // userDetails ke andr additionalDetails hai and additionalDetails ke andr profile ki id hai

        // Homework:unenroll user from enrolledCourses after deleting user account

        // 4>delete user
        await User.findByIdAndDelete({_id:id});

        

        // 5>return response
        return res.status(200).json({
          success:true,
          message:"User Account deleted successfully"
})

}
catch(error)
{
    console.log(`Error in deleteAccount()=> ${error}`);
    return res.status(500).json({
        success:false,
        message:"can't delete Account",
        error:error.message,
    })
}
}


// get all user details
exports.getAllUserDetails=async(req,res)=>{
    try
    {
        // kisi user ke saare details nikalne ke liye hume id ki jroorat hai jo ki hume
        // request(req.user.id) se mill jayega as user is logged in

        // 1>fetch id of user from request
        const id=req.user.id;
        // 2>perform validation
        const userDetails=await User.findById(id).populate('additionalDetails').exec();
        // populate('additionalDetails') ki wajah se User ke additionalDetails me sirf Profile ka id nhi blki Profile ka actual document dikhega
         console.log(`userDetails of getAllUserDetails() => ${userDetails}`)

        if(!userDetails)
        {
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        // 3>return response
        return res.status(200).json({
            success:true,
            message:" All User data fetched successfully",
            userDetails:userDetails
        })


    }
    catch(error)
    {
        console.log(`Error in deleteAccount()=> ${error}`);
        return res.status(500).json({
            success:false,
            message:"can't delete Account",
            error:error.message,
        })
    }
}

// updateDisplay picture
exports.updateDisplayPicture = async (req, res) => {
  try {

		const id = req.user.id;
	const user = await User.findById(id);
	if (!user) {
		return res.status(404).json({
            success: false,
            message: "User not found",
        });
	}
	const image = req.files.pfp;
	if (!image) {
		return res.status(404).json({
            success: false,
            message: "Image not found",
        });
    }
	const uploadDetails = await uploadImageToCloudinary(
		image,
		process.env.FOLDER_NAME
	);
	console.log(uploadDetails);

	const updatedImage = await User.findByIdAndUpdate(
    {_id:id},
    {image:uploadDetails.secure_url},
    { new: true }
  );

    res.status(200).json({
        success: true,
        message: "Image updated successfully",
        data: updatedImage,
    });
		
	} catch (error) {
		return res.status(500).json({
            success: false,
            message: error.message,
        });
		
	}

    // try {
    //   const displayPicture = req.files.displayPicture
    //   const userId = req.user.id
    //   const image = await uploadImageToCloudinary(
    //     displayPicture,
    //     process.env.FOLDER_NAME,
    //     1000,
    //     1000
    //   )
    //   console.log(`image in updateDisplayPicture() => ${image}`)
    //   const updatedProfile = await User.findByIdAndUpdate(
    //     { _id: userId },
    //     { image: image.secure_url },
    //     { new: true }
    //   )
    //   res.send({
    //     success: true,
    //     message: `Image Updated successfully`,
    //     data: updatedProfile,
    //   })
    // } catch (error) {
    //   console.log(`Error in updateDisplayPicture() => ${error}`);
    //   console.error(error)
    //   return res.status(500).json({
    //     success: false,
    //     message: error.message,
    //   })
    // }
};
  

// getEnrolledCourses
exports.getEnrolledCourses = async (req, res) => {

    try {
    const userId = req.user.id;
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();
    userDetails = userDetails.toObject();
    var SubsectionLength = 0;
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0;
      SubsectionLength = 0;
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce(
          (acc, curr) => acc + parseInt(curr.timeDuration),
          0
        );
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        );
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length;
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      });
      courseProgressCount = courseProgressCount?.completedVideos.length;
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100;
      } else {
        const multiplier = Math.pow(10, 2);
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier;
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      });
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
    // try {
    //   const userId = req.user.id
    //   const userDetails = await User.findOne({
    //     _id: userId,
    //   })
    //     .populate("courses")
    //     .exec()
    //   if (!userDetails) {
    //     return res.status(400).json({
    //       success: false,
    //       message: `Could not find user with id: ${userDetails}`,
    //     })
    //   }
    //   return res.status(200).json({
    //     success: true,
    //     data: userDetails.courses,
    //   })
    // } catch (error) {
    //   return res.status(500).json({
    //     success: false,
    //     message: error.message,
    //   })
    // }
};

exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id });

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length;
      const totalAmountGenerated = totalStudentsEnrolled * course.price;

      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,

        totalStudentsEnrolled,
        totalAmountGenerated,
      };

      return courseDataWithStats;
    });

    res.status(200).json({ courses: courseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};