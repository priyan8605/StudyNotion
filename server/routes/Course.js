const express = require("express");
const router = express.Router();

// Import the controller

// Course controller import
const {
  createCourse,
  showAllCourses,
  getCourseDetails,
  getAllCourses,
  getFullCourseDetails,
  editCourse,
  getInstructorCourses,
  deleteCourse,
  
} = require("../controllers/Course");

// Category controller import
const {
  showAllCategory,
  createCategory,
  categoryPageDetails,
} = require("../controllers/Category");

// Section controller import
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");

// SubSection controller import
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsection");

// Rating controller import
const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingAndReview");


const {
  auth,
  isInstructor,
  isStudent,
  isAdmin,
} = require("../middlewares/Auth");

const {
  updateCourseProgress,
  getProgressPercentage,
} = require("../controllers/CourseProgress");


// const {
//   updateCourseProgress
// } = require("../controllers/courseProgress");

router.post("/createCourse", auth, isInstructor, createCourse);

// router.post("/editCourse", auth, isInstructor, editCourse);

router.post("/addSection", auth, isInstructor, createSection);

router.post("/updateSection", auth, isInstructor, updateSection);

router.post("/deleteSection", auth, isInstructor, deleteSection);

router.post("/updateSubSection", auth, isInstructor, updateSubSection);

router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);

router.post("/addSubSection", auth, isInstructor, createSubSection);

router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);

router.get("/getAllCourses", showAllCourses);

router.post("/getCourseDetails", getCourseDetails);
router.post("/editCourse", auth, isInstructor, editCourse)


router.post("/getFullCourseDetails", auth, getFullCourseDetails);

router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

router.delete("/deleteCourse", deleteCourse);

router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategory);
router.post("/getCategoryPageDetails", categoryPageDetails);

// RatingAndReview controller route
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
 router.get("/getReviews", getAllRating);

module.exports = router;