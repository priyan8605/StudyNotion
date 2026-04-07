import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { ACCOUNT_TYPE } from "../../../utils/constants"

function InstructorRoute({ children }) {
  const { user } = useSelector((state) => state.profile)

  // If user not loaded yet, block render until available (let PrivateRoute handle auth)
  if (!user) return null

  if (user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) return children

  // If user is not instructor, redirect to dashboard home
  return <Navigate to="/dashboard/my-profile" />
}

export default InstructorRoute
