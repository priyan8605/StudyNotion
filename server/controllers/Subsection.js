const SubSection=require("../models/SubSection");
const Section=require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();
// Import necessary modules
// const Section = require("../models/Section")
// const SubSection = require("../models/SubSection")
// const { uploadImageToCloudinary } = require("../utils/imageUploader")

// Create a new sub-section for a given section
exports.createSubSection = async (req, res) => {
  try {
    // Extract necessary information from the request body
    const { sectionId, title, description } = req.body
    const video = req.files.video

    // Check if all necessary fields are provided
    if (!sectionId || !title || !description || !video) {
      return res
        .status(404)
        .json({ success: false, message: "All Fields are Required" })
    }
    console.log(video)

    // Upload the video file to Cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    )
    console.log(uploadDetails)
    // Create a new sub-section with the necessary information
    const SubSectionDetails = await SubSection.create({
      title: title,
      timeDuration: `${uploadDetails.duration}`,
      description: description,
      videoUrl: uploadDetails.secure_url,
    })

    // Update the corresponding section with the newly created sub-section
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subSection: SubSectionDetails._id } },
      { new: true }
    ).populate("subSection")

    // Return the updated section in the response
    return res.status(200).json({ success: true, data: updatedSection })
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error("Error creating new sub-section:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}


exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body
    const subSection = await SubSection.findById(subSectionId)

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      })
    }

    if (title !== undefined) {
      subSection.title = title
    }

    if (description !== undefined) {
      subSection.description = description
    }
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      )
      subSection.videoUrl = uploadDetails.secure_url
      subSection.timeDuration = `${uploadDetails.duration}`
    }

    await subSection.save()

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    )

    console.log("updated section", updatedSection)

    return res.json({
      success: true,
      message: "Section updated successfully",
      data: updatedSection,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    })
  }
}

exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      }
    )
    const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" })
    }

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    )

    return res.json({
      success: true,
      message: "SubSection deleted successfully",
      data: updatedSection,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubSection",
    })
  }
}
// createSubSection()
// exports.createSubSection=async(req,res)=>
// {
//     try
//     {
//         // SubSection create krne ke time hume "title","video to be uploaded","duration of video","description of a video"
//         // ye sbb dena hoga we also need to give "sectionId" kyu ki jo bhi SubSection create krenge vo kisi  Section me insert Krenge
//         // jiske liye "sectionId" hum de rhe hai

//         // 1>fetch data from req.body
//         const{sectionId,title,timeDuration,description}=req.body
        
//         // 2>extract file/video
//          const video=req.files.video;
//          console.log(`video file => ${video}`);

//         // 3>perform validation
//          if(!sectionId || !title || !timeDuration || !description || !video)
//          {
//             return res.status(401).json({
//                 success:false,
//                 message:"All fields are required to create sub-section"
//             })
//          }
         
//         // 4>upload video to cloudinary
//         // SubSection ke model me hum video nhi store krr he blki videoUrl store krr rhe hi of String type
//          const uploadDetails=await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
//         //  req.files.videoFile se jo  video fetch kiya oos "video" ko "FOLDER_NAME=CodeHelp" me store krr lenge which is
//         // defined in .env
//         // "uploadDetails" ke andr hi secureUrl mil jayega
         
//         // 5>create a SubSection 
//          const SubSectionDetails=await SubSection.create({
//             title:title,
//             timeDuration: `${uploadDetails.duration}`,
//             description:description,
//             videoUrl: uploadDetails.secure_url,
//          })
//         //  the id of Created SubSection inside Section where we will find section by sectionId
//         const updatedSection=await Section.findByIdAndUpdate(
//         {
//             _id:sectionId
//         },
//         {
//           $push:{
//             subSection:SubSectionDetails._id
//           }
//         },
//         {new:true}
//         )
//         .populate("subSection")
//         // HomeWork:log updated section here,after adding populate query
//          console.log(`updatedSection => ${updatedSection}`);
//         // 6>return response
//         return res.status(200).json({
//             success:true,
//             message:"SubSection created successfully",
//             data:updatedSection
            
//          })
//     }
//     catch(error)
//     {
//         console.log(`Error in createSubSection()=> ${error}`);
//         return res.status(500).json({
//             success:false,
//             message:"Can't create SubSection "
//         })
//     }
// }

// //homework:-updateSubSection

// exports.updateSubSection = async (req, res) => {
//     try {
//       //1>fetch data from req.body
//       const { sectionId, subSectionId, title, description } = req.body;
//       //2>Find the SubSection by ID
//       const subSection = await SubSection.findById(subSectionId);

//       //3> Handle Missing SubSection
//       if (!subSection) {
//         return res.status(404).json({
//           success: false,
//           message: "SubSection not found",
//         });
//       }

//        //4>Update Fields Conditionally
//       if (title !== undefined) {
//         subSection.title = title;
//       }
  
//       if (description !== undefined) {
//         subSection.description = description;
//       }

//       //5> Handle Video Upload
//       if (req.files && req.files.video !== undefined) {
//         const video = req.files.video;
//         const uploadDetails = await uploadImageToCloudinary(
//           video,
//           process.env.FOLDER_NAME
//         );
//         subSection.videoUrl = uploadDetails.secure_url;
//         subSection.timeDuration = `${uploadDetails.duration}`;
//       }
  
//       //6>Save the Updated SubSection
//       await subSection.save();
  
//       //7>Fetch the Updated Section
//       const updatedSection = await Section.findById(sectionId).populate(
//         "subSection"
//       );
  
//       console.log("updated section", updatedSection);

//       //8>Return Success Response
//       return res.json({
//         success: true,
//         message: "Section updated successfully",
//         data: updatedSection,
//       });
//     } 
//     catch (error) {
//       console.error(error);
//       return res.status(500).json({
//         success: false,
//         message: "An error occurred while updating the section",
//       });
//     }
//   };
  
//   //homework:-deleteSubSection
//   exports.deleteSubSection = async (req, res) => {
//     try {
//       const { subSectionId, sectionId } = req.body;
//       await Section.findByIdAndUpdate(
//         { _id: sectionId },
//         {
//           $pull: {
//             subSection: subSectionId,
//           },
//         }
//       );
//       const subSection = await SubSection.findByIdAndDelete({
//         _id: subSectionId,
//       });
  
//       if (!subSection) {
//         return res
//           .status(404)
//           .json({ success: false, message: "SubSection not found" });
//       }
  
//       const updatedSection = await Section.findById(sectionId).populate(
//         "subSection"
//       );
  
//       return res.json({
//         success: true,
//         message: "SubSection deleted successfully",
//         data: updatedSection,
//       });
//     }
//     catch (error) {
//       console.error(error);
//       return res.status(500).json({
//         success: false,
//         message: "An error occurred while deleting the SubSection",
//       });
//     }
//   };

