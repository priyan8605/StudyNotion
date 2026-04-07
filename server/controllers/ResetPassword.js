// when user enter the email for resetting the password mail will be sent on entered email for resetting the password
// then on user's entered email id frontend link will come and when user clicks on that frontend link another frontend screen 
// will open and user will input NewPassword and confirmPassword and after clicking on the "Reset password" button password will be changed

// 1>resetPasswordToken  ==> this will be used to send mail for resetting the password
// 2>resetPassword   ==> this will be used for making the entry of new password in DB

const User=require('../models/User');
const mailSender=require('../utils/mailSender')
const bcrypt=require("bcrypt")
const crypto=require('crypto')
exports.resetPasswordToken=async(req,res)=>{
    try
    {
        // 1>agr password reset krna hai to sbse pahle input me email user ne diya hoga
        // so fetch email from req.body
          const email=req.body.email;
       
        // 2>check whether user exists for the entered email by performing validation on email
           const user=await User.findOne({email:email});
           if(!user)
           {
            return res.json({
                success:false,
                message:"Your email is not registered"
            })
           }

        // 3>generate token
            const token=crypto.randomBytes(20).toString('hex');
            console.log(`token generated in resetPasswordToken() is =${token}`);

        //4> token aur token ka expiration time i.e "resetPasswordExpires:" we will add in User's model
        // so harr ekk user ke data ke andr khud kaa ekk token ho aur ooska expiration time bhi
        // 4>update user by adding token and it's expiration time
            const updatedDetails=await User.findOneAndUpdate({email:email},
                                {
                                    token:token,
                                    resetPasswordExpires:Date.now()+3600000,
                                    // Date.now() gives current time in ms 
                                    // +3600000 adds 1 hour (60 × 60 × 1000 ms)
                                  },
                                {
                                    new:true,//because of this updated document will return in response
                                }
                            )
                            console.log(`updatedDetails => ${updatedDetails}`);
        //   email ke aadhar pr user ko find out kiya and User schema ke token property me token update kiya
        // aur resetPasswordExpires property me expiration time update kiya 60 min

           
        // 5>create url or link
        const url=`http://localhost:3000/update-password/${token}`;//hrr ek different user ke liye different token bnega
        //mtlb token ka value different hoga and different token ke value ke aadhar pee different frontend link bnega

        // 6>send mail containing the url or link
        await mailSender(email,"Password reset link", `Your Link for email verification is ${url}. Please click this url to reset your password.`)

        // 7>return response
             return res.status(200).json({
                success:true,
                message:"Email sent successfully,please check email and change password"
             })
            //  when email will be sent and we click on link set in email another url will open in browser and in that url
            // there will be token => 90f85e5755909570b6783074ea8cf2e52b6c58f9

    }
    catch(error)
    {
        console.log(`Error in resetPassword() is = ${error}`);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while resetPassword in mail"
        })

    }
}

// resetPassword button
exports.resetPassword=async(req,res)=>{
try{
    // 1>fetch data
    const {password,confirmPassword,token}=req.body;
    // "token" to hum url me pass krr rhe hai to fetch to "url" se krna chahiye but hum yha fetch req.body se krr rhe hai
    // kyuki frontend is token ko url se body me daal rha hai isme hume kuchh nhi krna

    // 2>Perform validation on fetched data
      if(password!==confirmPassword)
      {
        return res.status(401).json({
            success:false,
            message:"Password is not matching confirmPassword"
        })
      }

    // 3>User ke andr jo password ka entry hai oose new password se update krna hai but iske liye hume User ka entry chahiye
    // so token ka use krke hum User ka entry nikalenge isiliye hum resetPasswordToken() ke andr 
    // USer me hum token ki entry daal rhe hai ==>  const updatedDetails=await User.findOneAndUpdate({email:email},token,{})
    // 3>In short User detail hum tbhi nikal ke laa skte hai jbb token valid hoga
        const userDetails=await User.findOne({token:token});//"token" ke aadhar prr userDetails find out krr ke layenge


    // 4>if we do not get an entry of token for user means it's invalid token
        if(!userDetails){
            return res.status(401).json({
                success:false,
                message:"token is invalid"
            })
        }

    // 5>if token time expires then also it's a invalid token
      if(userDetails.resetPasswordExpires < Date.now())
      {
        return res.json({
            success:false,
            message:'Token is expired, please regenerate your token'
        })
      }

    // 6>hash the password agr hum token ke aadhar prr user ka data le krr aa chuke hai
    const hashedPassword=await bcrypt.hash(password,10);

    // 7>Update the password
     // "token" ke basis prr User ko find krr ke lao aur "password" property ka value "hashedPassword"
    // update krr do and new wala document return krr do because of "new:true"
    await User.findOneAndUpdate({token:token},
                             {password:hashedPassword},
                            {new:true});
   

    // 8>return the response
    return res.status(200).json({
        success:true,
        message:"Password reset has been done successfully ",
    })
}
catch(error)
{
console.log(`Error  in resetPassword() is =${error}`);
return res.status(500).json({
    success:false,
    message:"Error occured in resetPassword, Please try again"
    
})
}
}
// resetPasswordToken is used to generated token in User entry
// resetPassword uses the token present in User's entry to reset the password