import { toast } from "react-hot-toast"

import { setProgress } from "../../slices/loadingBarSlice.js";
import { apiConnector } from "../apiconnector";
import { profileEndpoints } from "../aips";
import {settingsEndpoints} from "../aips"
import { logout } from "./authAPI.jsx";

import { setLoading, setUser } from "../../slices/profileSlice"

const {
  GET_USER_DETAILS_API,
  GET_USER_ENROLLED_COURSES_API,
  GET_INSTRUCTOR_DATA_API,
} = profileEndpoints

// (profileAPI.js) This is a Redux Thunk function
// SIMPLE: It returns a function that receives dispatch, allowing async operations
// DETAILED: A Thunk is a function that returns another function
// Thunk structure: (args) => async (dispatch) => { ...can dispatch multiple actions... }
// This allows handling of async operations (API calls) in Redux without side effects in components
export function getUserDetails(token, navigate) 
{
  // Returns: (dispatch) => { async code here }
  // Redux Thunk middleware will call this returned function with dispatch as parameter
  return async (dispatch) => {
    const toastId = toast.loading("Loading...") 

    dispatch(setLoading(true)) // Tell Redux to set loading = true (slice action from profileSlice)

    try 
    {
      // Step 1: Make async API call to get user data from backend
      const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
        Authorization: `Bearer ${token}`,
      })
      console.log("GET_USER_DETAILS API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      const userImage = response.data.data.image
        ? response.data.data.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`
      // Step 2: Send user data to Redux store via setUser (slice action from profileSlice)
      // This updates the Redux state with user details
      dispatch(setUser({ ...response.data.data, image: userImage }))
    } catch (error) {
      // Step 3: Handle errors - logout user and show error toast
      dispatch(logout(navigate))
      console.log("GET_USER_DETAILS API ERROR............", error)
      toast.error("Could Not Get User Details")
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))  // Tell Redux to set loading = false
  }
}

export async function getUserEnrolledCourses(token) {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    // console.log(
    //   "GET_USER_ENROLLED_COURSES_API API RESPONSE............",
    //   response
    // )

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data.data
  } catch (error) {
    console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error)
    toast.error("Could Not Get Enrolled Courses")
  }
  toast.dismiss(toastId)
  return result
}

export async function getInstructorData(token) {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, {
      Authorization: `Bearer ${token}`,
    })
    console.log("GET_INSTRUCTOR_DATA_API API RESPONSE............", response)
    result = response?.data?.courses
  } catch (error) {
    console.log("GET_INSTRUCTOR_DATA_API API ERROR............", error)
    toast.error("Could Not Get Instructor Data")
  }
  toast.dismiss(toastId)
  return result
}



//getEnrolledCourses
export async function getUserCourses(token,dispatch){
    // const toastId = toast.loading("Loading...");
    dispatch(setProgress);
    let result = []
    try {
      console.log("BEFORE Calling BACKEND API FOR ENROLLED COURSES");
      const response = await apiConnector(
        "GET",
        profileEndpoints.GET_USER_ENROLLED_COURSES_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      )
      console.log("AFTER Calling BACKEND API FOR ENROLLED COURSES");
    //   console.log(
    //     "GET_USER_ENROLLED_COURSES_API API RESPONSE............",
    //     response
    //   )
  
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      result = response.data.data;
    } catch (error) {
      console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error)
      toast.error("Could Not Get Enrolled Courses")
    }
    dispatch(setProgress(100));
    // toast.dismiss(toastId)
    return result
}


//updateProfilePicture
export async function updatePfp(token,pfp){
  const toastId = toast.loading("Uploading...");
  try {
    const formData = new FormData();
    console.log("pfp",pfp)
    formData.append('pfp',pfp);
    const response = await apiConnector("PUT", settingsEndpoints.UPDATE_DISPLAY_PICTURE_API,formData,{
      Authorization: `Bearer ${token}`,
    });
    console.log("UPDATE_DISPLAY_PICTURE_API API RESPONSE............", response)
    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Profile Picture Updated Successfully");
    const imageUrl = response.data.data.image;
    localStorage.setItem("user",JSON.stringify({...JSON.parse(localStorage.getItem("user")),image:imageUrl}));
    console.log(JSON.parse(localStorage.getItem("user")).image);
  } catch (error) {
    console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error)
    toast.error(error.response.data.message);
  }
  toast.dismiss(toastId);
}





//updateAdditionalDetails
export async function updateAdditionalDetails(token,additionalDetails){
  console.log("additionalDetails",additionalDetails);
  const {firstName,lastName,dateOfBirth,gender,contactNumber,about}=additionalDetails;
  console.log("additionalDetails",additionalDetails);
  const toastId = toast.loading("Updating...");
  try {
    const response = await apiConnector("PUT", settingsEndpoints.UPDATE_PROFILE_API,{firstName,lastName,dateOfBirth,gender,contactNumber,about},{
      Authorization: `Bearer ${token}`,
    });
    console.log("UPDATE_ADDITIONAL_DETAILS_API API RESPONSE............", response)
    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Additional Details Updated Successfully");
    const user = JSON.parse(localStorage.getItem("user"));
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.additionalDetails.dateOfBirth = dateOfBirth  || user.additionalDetails.dateOfBirth;
    user.additionalDetails.contactNumber = contactNumber || user.additionalDetails.contactNumber;
    user.additionalDetails.about = about || user.additionalDetails.about;
    user.additionalDetails.gender=gender
    localStorage.setItem("user",JSON.stringify(user));

  } catch (error) {
    console.log("UPDATE_ADDITIONAL_DETAILS_API API ERROR............", error)
    toast.error(error.response.data.message)
  }
  toast.dismiss(toastId);
}






//updatePassword
export async function updatePassword(token,password){
  const { oldPassword, newPassword, confirmPassword:confirmNewPassword }=password;
  console.log("password",password);
  const toastId = toast.loading("Updating...");
  try {
   const response = await apiConnector("POST", settingsEndpoints.CHANGE_PASSWORD_API,{oldPassword, newPassword, confirmNewPassword},{
      Authorization: `Bearer ${token}`,
    });
    console.log("UPDATE_PASSWORD_API API RESPONSE............", response)
    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Password Updated Successfully");
  }
  catch (error) {
    console.log("UPDATE_PASSWORD_API API ERROR............", error)
    toast.error(error.response.data.message)
  }
  toast.dismiss(toastId);
}



//deleteAccount
export async function deleteAccount(token,dispatch,navigate){
  const toastId = toast.loading("Deleting...");
  try {
    const response = await apiConnector("DELETE", settingsEndpoints.DELETE_PROFILE_API,null,{
      Authorization: `Bearer ${token}`,
    });
    console.log("DELETE_ACCOUNT_API API RESPONSE............", response)
    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Account Deleted Successfully");
    dispatch(logout(navigate))
  }
  catch (error) {
    console.log("DELETE_ACCOUNT_API API ERROR............", error)
    toast.error(error.response.data.message)
  }
  toast.dismiss(toastId);
}

//get instructor dashboard
export async function getInstructorDashboard(token,dispatch){
  // const toastId = toast.loading("Loading...");
  dispatch(setProgress);
  let result = []
  try {
    console.log("BEFORE Calling BACKEND API FOR INSTRUCTOR DASHBOARD");
    const response = await apiConnector(
      "GET",
      profileEndpoints.GET_ALL_INSTRUCTOR_DASHBOARD_DETAILS_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    console.log("AFTER Calling BACKEND API FOR INSTRUCTOR DASHBOARD");
    // console.log(
    //   "GET_INSTRUCTOR_DASHBOARD_API API RESPONSE............",
    //   response
    // )

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data.data;
  } catch (error) {
    console.log("GET_INSTRUCTOR_DASHBOARD_API API ERROR............", error)
    toast.error("Could Not Get Instructor Dashboard")
  }
  dispatch(setProgress(100));
  // toast.dismiss(toastId)
  return result
}