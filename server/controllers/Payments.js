/* eslint-disable no-unreachable */
// razorpay ka jo configuration hai that we have written in razorpay.js in config folder

const crypto = require('crypto');
const {instance}=require('../config/razorpay')
const Course=require('../models/Course')
const User=require('../models/User')
const mailSender=require('../utils/mailSender')
const {courseEnrollmentEmail}=require('../mail/templates/courseEnrollment');// import krr rhe hai kyu ki hume courseEnrollment ka mail bhej rhe hai
// const { default: mongoose } = require('mongoose')
const mongoose=require('mongoose')
const CourseProgress = require("../models/CourseProgress");
const { paymentSuccessEmail } = require("../mail/templates/PaymentSuccessEmail");



// initiate the razorpay order=>when we tap on Buy now an order is created
// jbb bhi buy now pr click krte hai to websites created order ka data store krr lete hai jisse buisnees ko pta
// chal jata hai ki koi user kharidari kr rha hai aur uske baad hi payment process start hota hai


exports.capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;
  if (!courses.length) {
    return res.json({ success: false, message: "Please Provide Course ID" });
  }
  let total_amount = 0;
  for (const course_id of courses) {
    let course;
    try {
      course = await Course.findById(course_id);
      if (!course) {
        return res
          .status(200)
          .json({ success: false, message: "Could not find the Course" });
      }
      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentsEnrolled.includes(uid)) {
        return res
          .status(200)
          .json({ success: false, message: "Student is already Enrolled" });
      }
      
      total_amount += course.price;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  };
  try {
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse);

    // adding return statement to avoid "headers already sent" error
    return res.json({
      success: true,
      data: paymentResponse,
    });
  } catch (error) {
    console.log(error);
    // adding return statement to avoid "headers already sent" error
    return res
      .status(500)
      .json({ success: false, message: "Could not initiate order." });
  }
};
// exports.capturePayment = async (req, res) => {
//     // jo course buy krna chahte hai uska id aur user ka id chahiye hume
//   const { courses } = req.body;
//   const userId = req.user.id;

// //   validation
//   if (!courses.length) {
//     return res.json({ success: false, message: "Please Provide Course ID" });
//   }

// //   calculate total amount for all the courses which user want to buy
//   let total_amount = 0;
//   for (const course_id of courses) {
//     let course;
//     try {
//       course = await Course.findById(course_id);
//       if (!course) {
//         return res
//           .status(200)
//           .json({ success: false, message: "Could not find the Course" });
//       }
    
//     // check whether user has already bought the course or not
//       const uid = new mongoose.Types.ObjectId(userId);
//       if (course.studentsEnrolled.includes(uid)) {
//         return res
//           .status(200)
//           .json({ success: false, message: "Student is already Enrolled" });
//       }
//     //   when user has not bought the course then we will add the price of that course to total amount
//       total_amount += course.price;
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({ success: false, message: error.message });
//     }
//   }

// //   create options for razorpay order
//   const options = {
//     amount: total_amount * 100,
//     currency: "INR",
//     receipt: Math.random(Date.now()).toString(),


// //     // 🔍 Explanation
// //a> amount: total_amount * 100

// // Razorpay expects the amount in the smallest currency unit.

// // For INR (Indian Rupees), the smallest unit is paise (₹1 = 100 paise).

// // So if total_amount is 500 (meaning ₹500), multiplying by 100 converts it to 50000 paise, which Razorpay understands.

// // b>currency: "INR"

// // Specifies the currency for the transaction.

// // "INR" means Indian Rupees. Razorpay supports multiple currencies, but you must explicitly set it.

// //c> receipt: Math.random(Date.now()).toString()

// // Razorpay requires a unique receipt ID for each order.

// // Here, you’re generating a pseudo-random string using Math.random() combined with Date.now().

// // This ensures uniqueness, though in production you’d usually use a more structured identifier (like "order_" + uuid).
//   };
//   try {
//     // initiate the payment using razorpay by creating an order with the above options
//     const paymentResponse = await instance.orders.create(options);
//     console.log(paymentResponse);
//     res.json({
        
//       success: true,
//       data: paymentResponse,
//     });
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .json({ success: false, message: "Could not initiate order." });
//   }
// };


// verify the payment
exports.verifyPayment = async (req, res) => {
    // for payment veification we need razorpay_order_id, razorpay_payment_id, razorpay_signature
    // 1. fetch data
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;
  const userId = req.user.id;

//   2. perform validation
  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" });
  }

//   3. verify signature
  let body = razorpay_order_id + "|" + razorpay_payment_id;//"|" is  a pipe operator which is used for concatenation of two strings in razorpay
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

    // 1>body = razorpay_order_id + "|" + razorpay_payment_id

// You’re joining the order ID and the payment ID into one string, separated by a pipe (|).

// Example: "order_ABC123|pay_DEF456".

// Razorpay requires this exact format when verifying payments.

// 2>crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)

// You’re creating an HMAC (Hash-based Message Authentication Code) using the SHA-256 algorithm.

// The secret key (RAZORPAY_SECRET) is your private key from Razorpay, stored safely in environment variables.

// 2>.update(body.toString())

// You feed the combined string (orderId|paymentId) into the HMAC function.

// 3>.digest("hex")

// Finally, you generate a hexadecimal string (the signature).

// This is the expectedSignature that your server calculates.


//   4. authenticate signature
  if (expectedSignature === razorpay_signature) {
    try {
      await enrollStudents(courses, userId);
      return res.status(200).json({ success: true, message: "Payment Verified" });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
  return res.status(200).json({ success: false, message: "Payment Failed" });
};

exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;

  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" });
  }

  try {
    // fetch the enrolled student details using userId so that we can send mail to that student
    const enrolledStudent = await User.findById(userId);

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,//razorpay gives amount in paise so we will convert it into rupees by dividing it by 100
        orderId,
        paymentId
      )
    );
  } catch (error) {
    console.log("error in sending mail", error);
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" });
  }
};

// enroll students in the courses
const enrollStudents = async (courses, userId) => {
    // validation
  if (!courses || !userId) {
    throw new Error("Please Provide Course ID and User ID");
  }
//   enroll the student in each course which he has bought
  for (const courseId of courses) {
    try {
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );
    // validation
      if (!enrolledCourse) {
        throw new Error("Course not found");
      }
      console.log("Updated course: ", enrolledCourse);
// after enrolling the student in the course we will also update the course list of the student
      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });
// User model ke "courses" property me courseId push krne ke sath sath courseProgress ka id bhi push kr denge taki jab bhi student course me progress dekhe to uske paas courseProgress ka id hoga jisse vo apna progress dekh ske
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      );

      console.log("Enrolled student: ", enrolledStudent);

    //   send confirmation mail to the student after enrolling him in the course
      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      );

      console.log("Email sent successfully: ", emailResponse.response);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
};

// // // capture the payment and initiate the razorpay payment
// // //With this below code we can only buy single item
// exports.capturePayment=async(req,res)=>
// {
//     try
//     {
//         // course kaun buy krr rha hai mtlb userId and kaunsa course buy krr rhaa hai mtlb courseId ye hume pta hona chahiye

//         // 1>fetch courseId and userId
//         const {course_id}=req.body 
//         const userId=req.user.id

//         // 2>perform validation

//         // a>check courseId is valid or not
//         if(!course_id)
//         {
//             return res.json({
//                 success:false,
//                 message:"Please Provide valid courseID"
//             })
//         }

//         // b>check courseDetail coming from course_id is valid or not
//         let course
//         try
//         {
//             course=await Course.findById(course_id);//course_id ke help se course ka data or detail mil jayega
//             if(!course)
//             {
//                 return res.json({
//                     success:false,
//                     message:"Could not find the Course"
//                 })
//             }

//             //c>check whether user have already paid for this course or not
//             // user ki id userId hum request se le hi rhe hai and userId is in string format
//             // Course model me user ki id  objectId ke form me stored hai
//             // studentsEnrolled:[{ type:mongoose.Schema.Types.ObjectId, ref:"User",required:true}]
//             //  so we will convert userId from string to objectId
//             const uid =new mongoose.Types.ObjectId.createFromHexString(userId) //convert userID from string to ObjectId
//             if(course.studentsEnrolled.includes(uid))
//             {
//                 // course me jo studentsEnrolled hai oosme agr pahle se pda hoga user ka objectId(i.e uid)
//                 return res.json({
//                     success:false,
//                     message:"Student is already enrolled for the course"
//                 })

//             }


//         }
//         catch(error)
//         {
//             console.log(`Error in capturePayment() validation==>${error}`);
//             return res.status(500).json({
//                 success:false,
//                error:error.message
//             })
//         }

//         // 3>create order
//         // Course model me "price:{ } defined hai" courseDetail me amount hogs to wha se fetch krr lenge "course.price"
//          const amount=await course.price;
//          const currency="INR";

//          const options={
//             // jo bhi course ka actual amount hoga oose 100 se multiply krna must  hai for razorpay payment
//             amount:amount*100,//must (which ever amount u want multiply that amount by 100 that is syntax)
//             currency,//must
//             receipt:Math.random(Date.now()).toString(),//optional
//             notes:{
//                 courseId:course_id,
//                 userId
//             }
//          }

//          try
//          {
//           //initiate the payment using razorpay
//           const paymentResponse=await instance.orders.create(options);//will create an order
//           console.log(paymentResponse);

//         //   response
//         res.status(200).json({
//             success:true,
//             courseName:course.courseName,
//             courseDescription:course.courseDescription,
//             thumbnail:course.thumbnail,
//             //agr humne order diya aur hum check krna chahta hai ki order ka status kya hai
//             // kya order out for delivery hai ya  vo mumbai me hai ya haryana me hai to know this we need orderId
//             orderId:paymentResponse.id,
//             currency:paymentResponse.currency,
//             amount:paymentResponse.amount
//         })
//          }
//          catch(error)
//          {
//             console.log(`Error in  capturePayment() while initiating payment==>${error}`);
//             return res.status(500).json({
//                 success:false,
//                 message:"Couldn't initiate payment",
//                error:error.message
//             })

//          }
//         // 4>return response

//         return res.status(200).json({
//             success:true,
//             message:"Payment Captured Successfully",
           
//         })
//     }
//         catch(error)
//         {
//            console.log(`Error in capturePayment()==>${error}`);
//            return res.status(500).json({
//                success:false,
//                message:"Failed to Capture Payment",
//               error:error.message
//            })
//         }
    
// }

// // // verify Signature of Razorpay and server(backend)
// exports.verifySignature=async(req,res)=>
// {
//     try
//     {
//         // server ke andr jo secret pda hai vo secret and razorpay ne jo secret bheja hai vo secret hume match krna hai
//         const webhookSecret='12345678';//secret present in the server

//         const signature=req.headers["x-razorpay-signature"];//razorpay ka signature server req ke header me se nikalega 
//         // and "x-razorpay-signature" is a predefined key for razorpay-signature
//         const shasum=crypto.createHmac("sha256",webhookSecret);//"sha256" is algo and "webhookSecret=12345678" is a secret key given to hmac
//         // "const shasum" is hmac object 
//         // Hmac means hash based message authentication code =>it requires hashing algorithm and secret key
//         // so HMAC works on top of hashing algorithm
//         // sha full form :- secure hashing algorithm is used to convert data into a encrypted format and it doesn't require anything
//         // SHA and HMAC both does the same thing which is to check the authenticity and integrity of a message their is only
//         // one difference that HMAC requires a secret_key whereas SHA doesn't requires anything
//         // client ne message bheja abb hum server prr verify krr rhe hai ki jo message aaya hai vo client ne jo bheja hai whi hai ya doosra 
//         // in short we server is checking the authenticity of a message that came to it by a client
        
//         // convert "shasum" hmac object into String
//         shasum.update(JSON.stringify(req.body));//"shasum" converted to string
//         const digest=shasum.digest('hex')//will convert "shasum" String into hexadecimal to protect data

//         // match digest and signature
//         if(signature===digest)
//         {
//             console.log("Payment is authorized");


//             const{courseId,userId}=req.body.payload.entity.notes;//testing krne time ye dekhenge
//             // capturePayment() me "options" variable ke andr "notes" ke andr "userId" ,"courseId" humne bheja hai
//             try
//             {
//                 // perform action

//     //  payment authorized hone ke baad abb koi action hona chahiye
// // "Action" ye hai ki user ko course me enroll krwao 
// // User ko course me agr enroll krwa rhe hai mtlb User modal ke "courses" property me jis course ke liye enroll ho rha hai 
// // oos particular course ka ObjectId store krwao  
// // ya to Course model ke "studentsEnrolled" me oos particular user ka Object id daalo

//                 // find the course and enroll the student in it
//                 const enrolledCourse=await Course.findOneAndUpdate(
//                     {
//                         _id:courseId
//                         // course find krr liya using courseId
//                     },
//                     {
//                         $push:{studentsEnrolled:userId}
//                         // Course model ke "studentsEnrolled" property me "userId" vo jo 
//                         // course me enroll ho rha hai ooska id push krr denge
//                     },
//                     {
//                         new:true
//                       //will give updated document in the response
//                     }
//                 );

//                 // validate response
//                 if(!enrolledCourse)
//                 {
//                     return res.status(500).json({
//                         success:false,
//                         message:"Course not found"
//                     })
//                 }
//                 console.log(`enrolledCourse===${enrolledCourse}`);

//                 // find the student and  and add him in the course
//                  const enrolledStudent=await User.findOneAndUpdate(
//                     {
//                         _id:userId
//                         // userId ke help se Student ko find kro
//                     },
//                     {
//                         $push:{courses:courseId}
//                         // User model ke "courses" property me "courseId" push krr denge
//                     },
//                     {
//                         new:true
//                         // 
//                     }
//                 )
//                 console.log(`enrolledStudent === ${enrolledStudent}`)

//                 // send confirmation mail to the student 
//                 const emailResponse=await mailSender(
//                     enrolledStudent.email,//email of student who enrolled for course
//                     "Congratulation from codeHelp",//title
//                     courseEnrollmentEmail(
//                         enrolledCourse.courseName,
//                         `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
//                       )
//                 )
//                 console.log(`emailResponse => ${emailResponse}`);
//                 return res.status(200).json({
//                   success:true,
//                   message:"Signature verified and Course added"
//                 })
//             }
//             catch(error)
//             {
//                 console.log(`Error in verifySignature() => ${error}`);
//                 return res.status(500).json({
//                     success:false,
//                     message:error.message
//                 })
                
//             }
//         }
//         else
//         {
//             // when signature do not matches "digest"
//             return res.status(400).json({
//                 success:false,
//                 message:"Invalid request"
//             })

//         }

//     }
//     catch(error)
//     {
//         console.log(`Error in capturePayment()==>${error}`);
//         return res.status(500).json({
//             success:false,
//             message:"Failed to Capture Payment",
//            error:error.message
//         })
//     }
// }




// code for buying multiple items present  in cart

// initiate the  razorpay order
// exports.capturePayment=async(req,res)=>{
//     const {courses}=req.body//fetch the id for all the courses which has to be bought
//     const {userId}=req.user.id  //fetch the user who is buying the course that user id
    
//     // 1. finding all the course present in cart and calculating the total amount
//     // authenticate
//     if(courses.length===0)  
//         {
//             return res.json({success:false,
//                 message:"Please provide course Id"
//             })
//         }

//         let totalAmount=0;
//         for(const course_id of courses)
//         {
//             // "course_id" will traverse on each element of "courses" array and
//             // will bring the id of the course present in "courses" array
//             let course;
//             try{
//                 course=await Course.findById(course_id);

//                //validation
//                 if(!course)
//                 {
//                     return res.status(200).json({
//                         success:false,
//                         message:"Could not find the course"
//                     })
//                 }

//                 // check whether user has already bought the course or not
//                 const uid=new mongoose.Types.ObjectId(userId)
//                 if(course.studentsEnrolled.includes(uid))
//                 {
//                     // when user has already bought the course
//                     return res.status(200).json({
//                         success:false,
//                         message:"Student is alrady enrolled"
//                     })
//                 }

//                 // when the user has not bought the course
//                 totalAmount=totalAmount+course.price;
//             }
//             catch(error)
//             {
//                console.log(error);
//                return res.status(500).json({
//                 success:false,
//                 message:error.message
//                })
//             }
//         }

//         //2. Creating options
//         const options={
//             // options object basically contains necessary details for
//             // the order
//             amount:totalAmount*100, // whatever be the amount multiply it by 100 it's syntax
//             currency:"INR",
//             receipt:Math.random(Date.now()).toString(),

//         }

//         //3. Now using "options" we will create an order
//         try{
//            const paymentResponse=await instance.orders.create(options);//creates an order
//         //    create() creates a new document in mongoDb collection
//            res.json({
//             success:true,
//             message:paymentResponse
//            })
//         }
//         catch(error)
//         {
//            console.log(error);
//            return res.status(500).json({
//             success:false,
//             message:"Could not initiate order",
//            })
//         }



// }   

// // Verify the payment
// exports.verifyPayment=async(req,res)=>{

//     // 1. fetch data
//     const razorpay_order_id=req.body?.razorpay_order_id;//fetching "razorpay_order_id" from req.body
//     const razorpay_payment_id=req.body?.razorpay_payment_id;//fetching "razorpay_payment_id" from req.body
//     const razorpay_signature=req.body?.razorpay_signature;//fetching "razorpay_signature" from req.body
//     const  courses=req.body?.courses;//fetching "courses" from req.body
//     const userId=req.user.id;//fetching "id" from req.user

//     //2.perform validation
//     if(!razorpay_order_id ||
//         !razorpay_payment_id ||
//         !razorpay_signature ||
//         !courses || !userId
//     ){
//         return res.status(200).json({
//             success:false,
//             message:"Payment failed"
//         })
//     }

//     // 3. Using "pipe" i.e "|" operator for concatenation
//     let body=razorpay_order_id+"|"+razorpay_payment_id;

//     // 4. it's must to write
//     const expectedSignature=crypto.createHmac("sha256",process.env.RAZORPAY_SECRET)
//     // is used to create an HMAC (Hash-based Message Authentication Code) using 
//     //the SHA-256    algorithm and a secret key stored in the environment variable 
//     //"RAZORPAY_SECRET" present in ".env" of "server"
//     .update(body.toString())
//     // .update(): This method updates the HMAC object with the data you want to hash. In this case, it converts the body to a string and updates the HMAC with this string.
//     // body.toString(): Converts the body object to a string format. This is necessary because the HMAC needs a string or buffer to generate the hash.
//     .digest("hex")// Generate the hash in hexadecimal format

//     //5. authenticate signature
//     if(expectedSignature === razorpay_signature)
//     {
//         // make student enroll
//           await enrollStudents(courses,userId,res);

//         // return the response
//         return res.status(200).json({
//             success:true,
//             message:"Payment Verified"
//         })
//     }
    
//     return res.status(200).json({
//         success:false,
//         message:"Payment failed"
//     })

//    const enrollStudents=async(courses,userId,res)=>{
//      // How to enroll students?
//     //=> 1>  when we have id's of all the courses and have current student userid so 
//     //we will traverse on all the course and inside each course student enrolled list
//     // insert the userid of student
//     // 2. The user who have bought the course
//     // insert the bought course courseid inside courses list of student or user
       
//     //    authenticate
//     if(!courses || !userId)
//     {
//         return res.status(400).json({
//             success:false,
//             message:"Please provide data for Courses or UserId"
//         })
//     }
//    }
    
//     // find the "Course" and the enroll the student in it
//       for(const courseId of courses)
//       {
//         try{
//         // find the course and enroll the student in it
//         const enrolledCourse=await Course.findOneAndUpdate(
//             {
//                 _id:courseId 
//             // co "Course" document ko find kro jiska "_id" "courseId" se match hota hai
//             },
//         {
//           $push:{studentsEnrolled:userId}
//         // "Course" document jiska "_id" and "userId" match ho gya  hai 
//         // ooske "studentsEnrolled" property me "userId" update krr do
//         },
//         {
//         new:true
//         // updated "Course" document update krr do
//         },
//     )
//     if(!enrolledCourse)
//     {
//         return res.status(500).json({
//             success:false,
//             message:"Course not found"
//         });
//     }
      
//      // find the student and add the course to their list of enrolledCourse
//     const enrolledStudent=await User.findByIdAndUpdate(
//         userId,
//         {
//             $push:{
//                 courses:courseId
//             }
//         },
//         {
//             new:true
//         }
//     )

//     // Send the mail to the student
//     const emailResponse=await mailSender(enrollStudents.email,
//         `Successfully enrolled into ${enrolledCourse.courseName}`,
//         courseEnrollmentEmail(enrolledCourse.courseName,`${enrolledStudent.firstNAme}`)
//     )
//     console.log("Email sent successfully",emailResponse.response);
//    }
//     catch(error)
//     {
//         console.log(error);
//         return res.status(500).json({
//             success:false,
//             message:error.message
//         })
//     }
//       }
// }

