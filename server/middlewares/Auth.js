const jwt=require('jsonwebtoken')
const User=require('../models/User')
// 1>auth middleware
// 2>isStudent middleware
// 3>isInstructor middleware
// 4>isAdmin Middleware

exports.auth=(req,res,next)=>{
    // next will call next middleware

    try{
    //   extract jwt token as token is present inside request body
    // we can extract token from body as well as header and as well as from cookies

    //1> extracting token from request body or cookies or header
  
     // jb bhi user ne login request kiya hoga server ne cookies client ko response me de diya hoga and 
   // Abb jbb user doobara request krega to ooske request me cookies bhi honge and cookies me token hai which we have assigned in "Auth.js" me already token present hai
    console.log("cookies",req.cookies.token);

     // jb bhi user ne login request kiya hoga server ne token client ko response me de diya hoga
   // Abb jbb user doobara request krega to ooske request ke body me already token present hai
    console.log("body",req.body.token);
    
    // const token=req.body.token || req.cookies.token || req.header('Authorization'.replace('Bearer ',''));
    // req.header('Authorization'.replace('Bearer','')); here it gives  error in decoding token
    const token = req.body.token || req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if(!token)//2>agr request ke body me token hai hi nhi then if() 
    {
      // sending response that token is missing in request body
         return res.status(401).json({
            success:false,
            message:'Token Missing'
         })
    }
     
    // 3>verify token
    try{
        // verify(<token>,<secret key>) =>gives us decoded token
        const decode=jwt.verify(token,process.env.JWT_SECRET)//token ke andr jo bhi value hai vo "payload" variable me store hoga
        console.log("decode is ");
        console.log(decode);//isme role bhi hoga jo ki Auth.js ke payload me define kiya hua hai
        req.user=decode;//"req" ke "user" object me decoded decoded token store krwa rhe hai jisme role bhi hai
       

    }
    catch(error)
    {
      console.error(`Error in decoding token ${token}`)
     return res.status(401).json({
        success:false,
        message:'token is invalid'
      })
    }
    next();//will take us to the next middleware
    }
    catch(error)
    {
       return res.status(401).json({
        success:false,
        message:"something went wrong while verifying the token"
       })
    }
}


// isStudent middleware is used for authorization as it's checking role
exports.isStudent=(req,res,next)=>{
    try{
        // checking authorization for student
     if(req.user.accountType !=='Student' )//token ke payload me "accountType=user.accountType" define kiya hai in Auth.js controller and ye "accountType" Auth.js middleware
    //  ke "decode" me bhi defined hai as "req.user=decode"
     {
        //agr "req" ke andr "user" ke andr "accountType" me "Student" nhi hai then if()
        //req.user=decode==>isse "decode" ke andr jo "accountType" hai that will get into "req.user"
        return res.status(401).json({
            success:false,
            message:"This is a protected route for student"
        })
     }
    //  no need to give success response here success true bcoz res is already defined in user.js routes

     next();
    }
    catch(error)
    {
        console.log(`error in isStudent() = ${error}`);
       return res.status(500).json({
         success:false,
         message:'User Role is not matching'
       })
    }
}




// isInstructor is used for authorization as it's checking for role
exports.isInstructor=async(req,res,next)=>{
    try{

        const userDetails = await User.findOne({ email: req.user.email });
		console.log(`userDetails in isInstructor() of middlewares ${userDetails}`);

		console.log(userDetails.accountType);
        // checking authorization for Instructor
     if(req.user.accountType !=='Instructor' )
     {
        //agr "req" ke andr "user" ke andr "accountType" me "Instructor" nhi hai then if()
        //req.user=decode==>isse "decode" ke andr jo role hai that will get into "req.user"
        return res.status(401).json({
            success:false,
            message:"This is a protected route for Instructor"
        })
     }

     next();// => will take to the other function which has bee defined in route
    //  router.post("/addSection", auth, isInstructor, createSection); here bcoz of next() after isInstructor(), createSection() will execute
    }
    catch(error)
    {
        console.log(`error in isInstructor() = ${error}`);
       return res.status(500).json({
         success:false,
         message:'User Role is not matching'
       })
    }
}

// isAdmin()
exports.isAdmin=(req,res,next)=>{
    try{
        // checking authorization for Admin
        console.log(`accountType in isAdmin() => ${req.user.accountType}`);
     if(req.user.accountType !=='Admin' )
     {
        //agr "req" ke andr "user" ke andr "accountType" me "Admin" nhi hai then if()
        //req.user=decode==>isse "decode" ke andr jo role hai that will get into "req.user"
        return res.status(401).json({
            success:false,
            message:"This is a protected route for Admin"
        })
     }
  //no need to give success response here success true bcoz res is already defined in user.js routes
  // defined inside user.js router.get('/admin',auth,isAdmin,(req,res)=>{
    //   res.status(200).json({
    //       success:true,
    //       message:"welcome to the protected route for Admin"
    //   })

     next();
    }
    catch(error)
    {
        console.log(`error in isAdmin() = ${error}`);
       return res.status(500).json({
         success:false,
         message:'User Role is not matching'
       })
    }
}