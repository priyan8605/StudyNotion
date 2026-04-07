const Section=require('../models/Section')
const Course=require('../models/Course')
const SubSection=require('../models/SubSection')
const mongoose=require('mongoose')
exports.createSection=async(req,res)=>{
    try
    {
        //1>fetch data
           const {sectionName,courseId}=await req.body;
            //courseId is required so that we can update section in course 
            // sectionName is required so that section ke naam ke accordingly DB me entry create krr  paye
             console.log(`sectionName => ${sectionName}`);
             console.log(`courseId => ${courseId}`);
        //2>perform validation from data fetched
        if(!sectionName ||!courseId)
        {
            return res.status(401).json({
                success:false,
                message:"Missing Properties"
            })
        }
         else{
        //3>create Section
           const newSection=await Section.create({sectionName})
           console.log(`newSection => ${newSection}`);
        //4>update course with section objectId
           const updatedCourseDetails=await Course.findByIdAndUpdate(courseId,
                                //    req.body se aaya courseId Db ke jiss bhi course ke id
                                // se match hoga oos course ko find krr ke layga
                                   
                                    {
                                        $push:{
                                            courseContent:newSection._id
                                        }
                                        // jo bhi course find hua ooske courseContent property me new created section ka id insert or push krr denge
                                    },
                                {new:true}
                            )
                            .populate({
                                path:'courseContent',
                                populate: {
                                    path: "subSection",
                                  },
                            })
                            .exec();
        console.log(`updatedCourseDetails => ${updatedCourseDetails}`);

        // 5>return success response
            res.status(200).json({
            success:true,
            message:"Section created successfully",
            updatedCourseDetails
        })
     }
    }
    catch(error)
    {
        console.log(`Error in createSection()==> ${error}`);
       return res.status(500).json({
            success:false,
            message:"Error occured in creating Section",
            error:error.message
        })
    }
}

// updateSection()
exports.updateSection=async(req,res)=>{
    try{
        // 1>fetch data
         const {sectionName,sectionId,courseId}=req.body

        // 2>perform validation on data fetched
        if(!sectionName||!sectionId)
        {
            return res.status(401).json({
                success:false,
                message:"All fields are required"
            })
        }

        // 3>update data of section ==>agr section ka data update krr rhe hai to course me jaake 
        // kuchh update krne ki jroorat nhi hai kyu ki course me section ka object id pda hua hai naa ki section ka data 
        //  re.body se hum sectionId le rhe hai so iss sectionId se section find krenge and oose update krr denge
        const section=await Section.findByIdAndUpdate(sectionId,
            {sectionName},
            {new:true}
        )
    // update data of course
        const course = await Course.findById(courseId)
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec();
      console.log(course);


         //4>return success response
          res.status(200).json({
            success:true,
            message:"Section updated successfully",
           section:section,
            data:course
         })
    }
    catch(error)
    {
        console.log(`Error in updateSection()==> ${error}`);
         res.status(500).json({
            success:false,
            message:"Error occured in updating Section",
            error:error.message
        })
    }
}

// deleteSection()
// exports.deleteSection=async(req,res)=>{
//     try{
//         //  1>fetch id from params  
//         // id hum req.body me bhi bhej skte hai but yha vo use naa krr kee params wala use krenge
//         const {sectionId,courseId}=req.body;
//          console.log('sectionId =>',sectionId)

//         // 2>use findByIdAndDelete

//           await Section.findByIdAndDelete(sectionId)
//         //   params me jo bhi sectionId aayyga vo same id wala Section find krr ke layga and oos Section ko delete 
//         // krr dega 

//          // [TODO =>see during Testing]:do we need to delete the entry from the Course Schema??
//         // abb jo bhi Section hum delete krr rhe hai DB se oos deleted Section ka id bhi hume Course Schema se hatana hoga 
//         console.log('sectionId =>',sectionId);
//         // await Course.findByIdAndUpdate(courseId, {
//         //     $pull: {
//         //       courseContent: sectionId,
//         //     },
//         //   });
        


//          //3>return success response
//          return res.status(200).json({
//             success:true,
//             message:"Section deleted successfully",
            
//          })
//     }
//     catch(error)
//     {
//         console.log(`Error in deleteSection()==> ${error}`);
//         return res.status(500).json({
//             success:false,
//             message:"Error occured in deleting Section",
//             error:error.message
//         })
//     }
// }

// exports.deleteSection = async (req, res) => {
// 	try {
// 		const { sectionId,courseId } = req.body || req.params;
//             console.log('sectionId =>',sectionId)
//             console.log('courseId =>',courseId)
//             if (!sectionId || !mongoose.Types.ObjectId.isValid(sectionId)) {
//       return res.status(400).json({ success: false, message: "Invalid or missing sectionId" });
//     }
//     if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
//       return res.status(400).json({ success: false, message: "Invalid or missing courseId" });
//     }
// 		await Section.findByIdAndDelete(sectionId);
// 		const updatedCourse = await Course.findById(courseId).populate({ path: "courseContent", populate: { path: "subSection" } }).exec();
// 		res.status(200).json({
// 			success: true,
// 			message: "Section deleted",
// 			updatedCourse,
// 		});
// 	} catch (error) {
// 		console.error("Error deleting section:", error);
// 		res.status(500).json({
// 			success: false,
// 			message: "Internal server error",
// 		});
// 	}
// };

exports.deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body;
    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        courseContent: sectionId,
      },
    });
    const section = await Section.findById(sectionId);
    console.log(sectionId, courseId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    await SubSection.deleteMany({ _id: { $in: section.subSection } });

    await Section.findByIdAndDelete(sectionId);

    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    res.status(200).json({
      success: true,
      message: "Section deleted",
      data: course,
    });
  } catch (error) {
    console.error("Error deleting section:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
