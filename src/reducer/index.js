import {combineReducers} from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice"
import profileReducer from "../slices/profileSlice"
import cartReducer from "../slices/cartSlice";
import loadingBarReducer from "../slices/loadingBarSlice"
import courseReducer from "../slices/courseSlice"
import viewCourseReducer from "../slices/viewCourseSlice"
const rootReducer=combineReducers({
 auth:authReducer,
 profile:profileReducer,
 cart:cartReducer,
 loadingBar: loadingBarReducer,
 course:courseReducer,
 viewCourse:viewCourseReducer,
})
export default rootReducer

//1> we will have multiple reducer such as reducer for authentication,
// reducer for profile, reducer for cart ,etc to combine all these
// reducer we use "combineReducers"
// 2>Now using "combineReducers" we make rootReducer and we add "rootReducer" in store
// 3>All these reducer are made from slice so make slice for each reducer
// 46:20