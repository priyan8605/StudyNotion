import React from 'react'
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { resetCourseState, setCourse, setEditCourse, setStep } from '../../../../slices/courseSlice';
import { COURSE_STATUS } from '../../../../utils/constants';
import { addCourseToCategory, editCourseDetails } from '../../../../services/operations/courseDetailsAPI';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import IconBtn from "../../../Common/IconBtn"


export default function PublishCourse() {
  const { register, handleSubmit, setValue, getValues } = useForm()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (course?.status === COURSE_STATUS.PUBLISHED) {
      setValue("public", true)
    }
  }, [])

  const goBack = () => {
    dispatch(setStep(2))
  }

  const goToCourses = () => {
    dispatch(resetCourseState())
    navigate("/dashboard/my-courses")
    // navigate("/dashboard/add-course")
  }

  const handleCoursePublish = async () => {
    //   ye method formData ke andar course ki id aur status bhejega backend ko taki backend course ka status update kar sake

    // check if form has been updated or not
    if (
      (course?.status === COURSE_STATUS.PUBLISHED &&
        getValues("public") === true) ||
      (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false)
    ) {
      // form has not been updated
      // no need to make api call
      goToCourses()
      return
    }
    const formData = new FormData()
    formData.append("courseId", course._id)
    const courseStatus = getValues("public")
      ? COURSE_STATUS.PUBLISHED
      : COURSE_STATUS.DRAFT
    formData.append("status", courseStatus)
    setLoading(true)
    const result = await editCourseDetails(formData, token)
    if (result) {
      goToCourses()
    }
    setLoading(false)
  }

  const onSubmit = (data) => {
    // console.log(data)
    handleCoursePublish()
  }

  return (
    <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">
        Publish Settings
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Checkbox */}
        <div className="my-6 mb-8">
          <label htmlFor="public" className="inline-flex items-center text-lg">
            <input
              type="checkbox"
              id="public"
              {...register("public")}
              className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
            />
            <span className="ml-2 text-richblack-400">
              Make this course as public
            </span>
          </label>
        </div>

        {/* Next Prev Button */}
        <div className="ml-auto flex max-w-max items-center gap-x-4">
          <button
            disabled={loading}
            type="button"
            onClick={goBack}
            className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
          >
            Back
          </button>
          <IconBtn disabled={loading} text="Save Changes" />
        </div>
      </form>
    </div>
  )
}

// const PublishCourse = () => {
//     const {register, handleSubmit, setValue, getValues, formState: {errors}} = useForm();
//     const {token} = useSelector((state) => state.auth);
//     const {course} = useSelector((state) => state.course);
//     const [loading, setLoading] = useState(false);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     useEffect(() => {
//         if(course?.status=== COURSE_STATUS.PUBLISHED) {
//             setValue("public", true);
//           //jbb pehla render hoga tabhi course ki value aayegi aur uske baad hi setValue call hoga taki form state update ho jaye
//         }
//     },[]);

//     const goBack = () => {
//         dispatch(setStep(2));
//     }

//     const goToMyCourses = () => {
//         dispatch(resetCourseState())
//         // navigate("/dashboard/my-courses");
//     }

//     const handelPublish = async () => {
//         if((course?.status === COURSE_STATUS.PUBLISHED && getValues("public") === true) ||( course?.status === COURSE_STATUS.DRAFT && getValues("public") === false)) {
//             // jbb course already published hai aur user ne public checkbox ko check kiya hai
//             //  ya jbb course draft hai aur user ne public checkbox ko uncheck kiya hai tabhi
//             //  goToMyCourses call hoga taki unnecessary API call na ho
//             goToMyCourses();
//             setLoading(false);
//             dispatch(setStep(1));
//             dispatch(setEditCourse(null));
//             return;
//         }

//         // if form is updated
//         const formData = new FormData();
//         formData.append("courseId", course._id);
//         // formData.append("status", getValues("public") ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT);
//         const courseStatus = getValues("public") ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT;
//         formData.append("status", courseStatus);
//         setLoading(true);
//         const result = await editCourseDetails(formData, token);
//         const category_id= await course.category;
//         console.log("category_id",category_id);
//         const addCourseCategory = await addCourseToCategory({categoryId:category_id,courseId:course._id},token);
//         if(result && addCourseCategory) {
//             goToMyCourses();
//         } else {
//             toast.error("Something went wrong");
//         }
//         if(addCourseCategory) {
//         dispatch(setStep(1));
//         dispatch(setEditCourse(null));
//         setLoading(false);
//         }
//     }
        

//     const onSubmit = (data) => {
//         setLoading(true);
//         handelPublish(data);
//     }

//   return (
//     <div>
//         <div className='rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6'>
//             <p className='text-2xl font-semibold text-richblack-5' >Publish Settings</p>
//             <form onSubmit={handleSubmit(onSubmit)}>
//             <div className='my-6 mb-8'>
//             <label htmlFor="public" className="inline-flex items-center text-lg">
//                 <input defaultChecked={false} type="checkbox" id="public" name="public" className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5" 
//                 {...register("public")} />
//                 <span className="ml-2 text-richblack-400">Make this course as public</span>
//             </label>
//             </div>
//             <div className="ml-auto flex max-w-max items-center gap-x-4">
//                 <button disabled={loading} onClick={goBack} type="button" className="flex cursor-pointer items-center 
//                 gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900">
//                     Back
//                 </button>
//                 <button disabled={loading} type='submit' className="flex items-center bg-yellow-50 cursor-pointer gap-x-2 
//                 rounded-md py-2 px-5 font-semibold text-richblack-900 undefined">
//                     Save Changes
//                 </button>
//                 </div>
//             </form>
//         </div>
//     </div>
//   )
// }

// export default PublishCourse