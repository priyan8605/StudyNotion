import React, { useState } from "react"
import { BiArrowBack } from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { getPasswordResetToken } from "../services/operations/authAPI"
const ForgotPassword = (props) => {

      const [emailSent,setEmailSent]=useState(false);
      const [email,setEmail]=useState("");

    const {loading}=useSelector((state)=>state.auth);
    // useSelector is pulling the loading state from the auth slice in the Redux store.
    // Inside "auth" slice "initialState" property is defined and inside the "initialState"
    // there is a code "loading" that "loading" is getting fetched

    const dispatch = useDispatch()
    const handleOnSubmit = (e) => {
      e.preventDefault()
      dispatch(getPasswordResetToken(email, setEmailSent))
      // when clicked on "Reset your Password" then email goes to the user, inside email
      // there is link and in that link there is a token ,when we click on the link with the token we will go to "update-password" route
    }

  return (
    <div>
      {
        loading ? (
            <div>Loading .....</div>
        ):
        (
            <div>
              <h1>
                {
                    !emailSent ? ("Reset your Password"):("Check your email")
                }
              </h1>
              <p>
                {/*This paragraph will depend whether the email is sent or not */}
                {
                  !emailSent ? (
                    `Have no fear. We'll email you instructions to reset your password                  
                      If you don't have access to your email we can try account recovery`
                    ):
                    (
                        `We have sent the reset email to ${email}`
                    )
                }
                
              </p>
              <form onSubmit={handleOnSubmit}>
                {
                    // whether the input field will come or not that will depend on whether the email is sent or not
                    !emailSent && (
                        // This will only be seen when email is not sent
                      <label className="w-full">
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                          Email Address
                        </p>
                        <input
                         required
                         type="email"
                         name="email"
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         placeholder="Enter email address"
                         className="form-style w-full"/>
                      </label>
                    )
                }
                  <button
              type="submit"
              className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] 
              font-medium text-richblack-900">
              {!emailSent ? "Reset Password" : "Resend Email"}
            </button>
              </form>

              <div className="mt-6 flex items-center justify-between">
            <Link to="/login">
              <p className="flex items-center gap-x-2 text-richblack-5">
                <BiArrowBack /> Back To Login
              </p>
            </Link>
          </div>
          
            </div>
        )
      }
    </div>
  )
};

export default ForgotPassword;
