import React from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  setCourse,
  setEditCourse,
  setStep,
} from "../../../../../slices/courseSlice";
import NestedView from "./NestedView.jsx";
import toast from "react-hot-toast";
import {
  createSection,
  updateSection,
} from "../../../../../services/operations/courseDetailsAPI";
import { IoAddCircleOutline } from "react-icons/io5"
import { MdNavigateNext } from "react-icons/md"
import IconBtn from "../../../../Common/IconBtn"


export default function CourseBuilderForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [editSectionName, setEditSectionName] = useState(null)
  const dispatch = useDispatch()

  // handle form submission
  const onSubmit = async (data) => {
    // console.log(data)
    setLoading(true)

    let result

    if (editSectionName) {
      result = await updateSection(
        {
          sectionName: data.sectionName,
          sectionId: editSectionName,
          courseId: course._id,
        },
        token
      )
      // console.log("edit", result)
    } else {
      result = await createSection(
        {
          sectionName: data.sectionName,
          courseId: course._id,
        },
        token
      )
    }
    if (result) {
      // console.log("section result", result)
      dispatch(setCourse(result))
      setEditSectionName(null)
      setValue("sectionName", "")
    }
    setLoading(false)
  }

  const cancelEdit = () => {
    setEditSectionName(null)
    setValue("sectionName", "")
  }

  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancelEdit()
      return
    }
    setEditSectionName(sectionId)
    setValue("sectionName", sectionName)
  }

  const goToNext = () => {
    if (course.courseContent.length === 0) {
      toast.error("Please add atleast one section")
      return
    }
    if (
      course.courseContent.some((section) => section.subSection.length === 0)
    ) {
      toast.error("Please add atleast one lecture in each section")
      return
    }
    dispatch(setStep(3))
  }

  const goBack = () => {
    dispatch(setStep(1))
    dispatch(setEditCourse(true))
  }

  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="sectionName">
            Section Name <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="sectionName"
            disabled={loading}
            placeholder="Add a section to build your course"
            {...register("sectionName", { required: true })}
            className="form-style w-full"
          />
          {errors.sectionName && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Section name is required
            </span>
          )}
        </div>
        <div className="flex items-end gap-x-4">
          <IconBtn
            type="submit"
            disabled={loading}
            text={editSectionName ? "Edit Section Name" : "Create Section"}
            outline={true}
          >
            <IoAddCircleOutline size={20} className="text-yellow-50" />
          </IconBtn>
          {editSectionName && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-richblack-300 underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
      {course.courseContent.length > 0 && (
        <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
      )}
      {/* Next Prev Button */}
      <div className="flex justify-end gap-x-3">
        <button
          onClick={goBack}
          className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
        >
          Back
        </button>
        <IconBtn disabled={loading} text="Next" onclick={goToNext}>
          <MdNavigateNext />
        </IconBtn>
      </div>
    </div>
  )
}

// const CourseBuilderForm = () => {
//   const { token } = useSelector((state) => state.auth);
//   const [editSectionName, setEditSectionName] = React.useState(false);
//   const [loading, setLoading] = useState(false);
//   const dispatch = useDispatch();
//   const { course } = useSelector((state) => state.course);

//   const gonext = () => {
//     // if (course.courseContent.length > 0) {
//     //   if (
//     //     course.courseContent.some((section) => section.subSection.length > 0)
//     //   ) {
//     //     dispatch(setStep(3));
//     //   } else {
//     //     toast.error("Please add atleast one lesson to esch section");
//     //   }
//     // } else {
//     //   toast.error("Please add atleast one section to continue");
//     // }
//     if(course.courseContent.length === 0) {
//       toast.error("Please add atleast one section ");
//       return;
//     }
//     if(course.courseContent.some((section) => section.subSection.length === 0)) {
//       toast.error("Please add atleast one lecture to each section");
//       return;
//     }
//     //if everything is fine then only go to next step
//     dispatch(setStep(3));
//   };

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = async (data) => {
//     let result=null;
//     setLoading(true);
//     if (editSectionName) {
//       result = await updateSection(
//         {
//           sectionName: data.sectionName,
//           courseId: course._id,
//           sectionId: editSectionName,
//         },
//         token
//         // courseDetailsAPI ke andar updateSection function me hum data and token pass kiye hai
        
//       );
//     } else {
//       result = await createSection(
//         {
//           sectionName: data.sectionName,
//           sectionId: editSectionName,
//           courseId: course._id,
//         },
//         token
//       );
//     }
//     // update value  kyuki section add hone se because of onSubmit course update hoga
//     if (result) {
//       dispatch(setCourse(result));//course hoga update with new section
//       setValue("sectionName", "");//sectionName ko empty kr denge 
//       setEditSectionName(false);
//     }
//     setLoading(false);
//   };
//   const cancelEdit = () => {
//     setEditSectionName(false);
//     setValue("sectionName", "");
//   }


//   const handelChangeEditSectionName = (sectionId,sectionName) => {
//     if (editSectionName===sectionId) {
//     cancelEdit()
//     return;
//     }
//     setEditSectionName(sectionId);
//     setValue("sectionName", sectionName);
//   };

//   return (
//     <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
//       <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <label className="text-sm text-richblack-5" htmlFor="sectionName">
//           Section Name<sup className="text-pink-200">*</sup>
//         </label>
//         <input
//           id="sectionName"
//           placeholder="Add a section to build your course"
//           name="sectionName"
//           className="form-style w-full"
//           {...register("sectionName", { required: true })}
//         />
//         {errors.sectionName && (
//           <p className="ml-2 text-xs tracking-wide text-pink-200">This field is required</p>
//         )}
//         <div className="flex items-end gap-x-4">
//           <button
//             type="submit"
//             className="flex items-center border border-yellow-50 bg-transparent cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 undefined"
//           >
//             <span className="text-yellow-50">
//               {editSectionName ? "Edit Section Name" : "Create Section"}
//             </span>
//             <AiOutlinePlusCircle size={20} className="text-yellow-50" />
//           </button>
//           {editSectionName && (
//             <button
//               onClick={() => {
//                 setEditSectionName(false);
//                 setValue("sectionName", "");
//               }}
//               type="button"
//               className="text-sm text-richblack-300 underline"
//             >
//               Cancel Edit
//             </button>
//           )}
//         </div>
//       </form>
//       {
//         // section course ke andr courseContent ke andr ek array hota hai jisme sections hote hai or har section ke andr 
//         // subSection hote hai, to hum check karenge ki courseContent me koi section hai ya nahi, agar hai to 
//         // hi NestedView component show karenge taki wo unnecessary render na ho jab courseContent empty ho
//       course.courseContent.length > 0 &&( <NestedView handelChangeEditSectionName={handelChangeEditSectionName} />)
//       // agar courseContent me sections hai to hi NestedView component show karenge taki wo unnecessary render na ho jab courseContent empty ho
//       }
//       <div className="flex justify-end gap-x-3">
//         <button
//           onClick={() => {
//             dispatch(setStep(1));
//             dispatch(setEditCourse(true));
//             // abb yha jbb piche jaayenge to course ko edit krenge naa ki create,
//             //  to isliye setEditCourse ko true kr denge taki jab courseInformationForm me
//             //  jaaye to wo edit mode me rahe
//           }}
//           className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
//         >
//           Back
//         </button>
//         <button
//           onClick={gonext}
//           className="flex items-center bg-yellow-50 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 undefined"
//         >
//           <span className="false">Next</span>
//           <svg
//             stroke="currentColor"
//             fill="currentColor"
//             strokeWidth="0"
//             viewBox="0 0 24 24"
//             height="1em"
//             width="1em"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path fill="none" d="M0 0h24v24H0z"></path>
//             <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CourseBuilderForm;
