
import './App.css';
import Navbar from './components/Common/Navbar';
import {Route,Routes, useNavigate} from 'react-router-dom';
import PrivateRoute from './components/core/Auth/PrivateRoute';
import { useEffect } from "react"
import { getUserDetails } from "./services/operations/profileAPI"

// Pages
import Home from "./Pages/Home"
import Login from "./Pages/Login"
import Signup from "./Pages/Signup"
import UpdatePassword from "./Pages/UpdatePassword"
import VerifyEmail from "./Pages/VerifyEmail"
import CourseDetails from "./Pages/CourseDetails"
import Catalog from './Pages/Catalog';
import ForgotPassword from './Pages/ForgotPassword';
import Dashboard from "./Pages/Dashboard"
import OpenRoute from './components/core/Auth/OpenRoute';
import Instructor from './components/core/Dashboard/Instructor';
import { setProgress } from "./slices/loadingBarSlice";
import { RiWifiOffLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import About from './Pages/About';
import ContactUs from './Pages/ContactUs';
import MyProfile from './components/core/Dashboard/MyProfile';
import Error from './Pages/Error';
import Settings from './components/core/Dashboard/Settings';
import EnrolledCourses from './components/core/Dashboard/EnrolledCourses';
import { ACCOUNT_TYPE } from "./utils/constants";
import Cart from './components/core/Dashboard/Cart/index.jsx';
import AddCourse from "./components/core/Dashboard/AddCourse/index.jsx"
import MyCourses from "./components/core/Dashboard/MyCourses.jsx"
import EditCourse from "./components/core/Dashboard/EditCourse/index.jsx"
import ViewCourse from "./Pages/ViewCourse"
import VideoDetails from "./components/core/ViewCourse/VideoDetails.jsx"

// Support cases where the imported value is a module object (has a .default)
// const AddCourseComponent = AddCourse && AddCourse.default ? AddCourse.default : AddCourse;
function App() {
   
  console.log("Cart",Cart );
  console.log("AddCourse",AddCourse );
  const navigate = useNavigate()


    const user = useSelector((state) => state.profile.user);
  const progress = useSelector((state) => state.loadingBar);
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = JSON.parse(localStorage.getItem("token"))
      dispatch(getUserDetails(token, navigate))
    }

  }, [])

  return (
    <div className='w-screen min-h-screen bg-richblack-900 flex-col font-inter'>
    <Navbar  setProgress={setProgress}>
    </Navbar>
     <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='catalog/:catalogName' element={<Catalog/>}/>
      <Route path='courses/:courseId' element={<CourseDetails/>} />

      <Route
          path="login"
          element={
            <OpenRoute>
              {/* <OpenRoute></OpenRoute> it just means which ever is non logged in user that can login*/}
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />
        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />
        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
         <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />

       <Route
       path="update-password/:id"
      //  :id is dynamic parameter which we will get from the backend when we request for password reset 
      // and we will use that id to identify the user whose password is to be reset in short it's token to identify the user
       element={
         <OpenRoute>
           <UpdatePassword />
         </OpenRoute>
       }
       />

        

         <Route
       path="about"
       element={
        
           <About />
       }
       />
        
         <Route
       path="contact"
       element={
           <ContactUs />
       }
       />
        <Route element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } >
         <Route path="dashboard/my-profile" element={<MyProfile />} />
         {/* issue jbb use login rhega tbhi  "dashboard/my-profile" prr jaa payega */}
         <Route path="dashboard/settings" element={<Settings />} />
           
         {user && user?.accountType === ACCOUNT_TYPE.STUDENT && (
           <>
           <Route path="dashboard/cart" element={<Cart />} />
           <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
           </>
         )}

        {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              {/* <Route path="dashboard/add-course" element={    AddCourse?.default ? <AddCourse.default /> : <AddCourse />} /> */}
                <Route path="dashboard/add-course" element={    <AddCourse />} />
                <Route path="dashboard/my-courses" element={<MyCourses />} />
                 <Route
                path="dashboard/edit-course/:courseId"
                element={<EditCourse />}
              />
              <Route path="dashboard/instructor" element={<Instructor />} />

            </>
          )}

        </Route>


         <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
              />
            </>
          )}
        </Route>
        <Route path='*' element={<Error/>} />
     </Routes>
    </div>
  );
}

export default App;
