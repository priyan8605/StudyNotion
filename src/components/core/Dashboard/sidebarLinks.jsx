import React from 'react'
import * as Icons from "react-icons/vsc"
import { useDispatch } from "react-redux"
import { NavLink, matchPath, useLocation } from "react-router-dom"
import { resetCourseState } from "../../../slices/courseSlice"
import { Link} from 'react-router-dom';
import * as Icons1 from 'react-icons/ai'
import * as Icons2 from 'react-icons/vsc'


const SidebarLink = ({ link, iconName }) => {
  // Call hooks unconditionally (must not be conditional)
  const location = useLocation();
  const dispatch = useDispatch();

  // defensive: if link not provided, do not render anything
  if (!link) return null;

  // support icon passed via link.icon or the separate iconName prop
  const iconKey = link?.icon || iconName;
  const Icon = (Icons1[iconKey] || Icons2[iconKey]) || null;

  const matchRoute = (linkPath) => {
    if (!linkPath) return false
    return matchPath({ path: linkPath }, location.pathname)
  }

  return (
    <div>
      <Link
        to={link.path}
        onClick={() => dispatch(resetCourseState())}
        className={`relative flex gap-x-2 items-center text-sm font-medium px-3 md:px-8 py-2 cursor-pointer transition-all duration-200
        ${matchRoute(link.path) ? 'text-yellow-50 bg-yellow-800' : 'text-richblack-300'}`}
      >
        <span className={`absolute left-0 top-0 h-full w-[0.15rem] bg-yellow-50 ${matchRoute(link.path) ? ' opacity-100 ' : 'opacity-0'}`} >
        </span>

        {Icon && <Icon className='text-lg' />}
        <p className='hidden md:block uppercase tracking-wider'>{link.name}</p>
      </Link>
    </div>
  )
}

export default SidebarLink

// export default function SidebarLink({ link, iconName }) {
//   const Icon = Icons[iconName]//dynamic icon import kr rhe hai
//   // Icons[iconName] =>Icons:
// // This is usually an object (or map) that contains multiple icon components. For example:
// // const Icons = {
// //   home: HomeIcon,
// //   user: UserIcon,
// //   settings: SettingsIcon
// // };

// // This uses bracket notation to dynamically access a property of the Icons object.

// // If iconName = "home", then Icons[iconName] → Icons["home"] → HomeIcon.

// // If iconName = "user", then Icons[iconName] → UserIcon.
//   const location = useLocation();//needed because we have to match the current route with the link path
//   // aur if match krta hai to uss link ko highlight krna hai mtlb that link is clicked or active and show it visually
//   const dispatch = useDispatch()

//   const matchRoute = (route) => {
//     // matchPath is a function from react-router-dom that checks if the current location matches a specific route
//     return matchPath({ path: route }, location.pathname)
//   }

  

//   return (
//     <NavLink
//       to={link.path}
//       onClick={() => dispatch(resetCourseState())}
//       className={`relative px-8 py-2 text-sm font-medium ${
//         matchRoute(link.path)
//           ? "bg-yellow-800 text-yellow-50"
//           : "bg-opacity-0 text-richblack-300"
//       } transition-all duration-200`}
//     >
//       <span
//         className={`absolute left-0 top-0 h-full w-[0.15rem] bg-yellow-50 ${
//           matchRoute(link.path) ? "opacity-100" : "opacity-0"
//         }`}
//       ></span>
//       <div className="flex items-center gap-x-2">
//         {/* Icon Goes Here */}
//         <Icon className="text-lg" />
//         <span>{link.name}</span>
//       </div>
//     </NavLink>
//   )
// }