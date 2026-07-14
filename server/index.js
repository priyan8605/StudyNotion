const path = require('path');


const dotenv=require('dotenv')
require('dotenv').config({ path: path.join(__dirname, '.env') })
// require('dotenv').config() is a line of code used in Node.js applications to load environment variables from a .env file into process.env.

const express=require('express')
const app=express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())

const userRoutes=require('./routes/User')
const profileRoutes=require('./routes/Profile')
const paymentRoutes=require('./routes/Payments')
const courseRoutes=require('./routes/Course')

const database=require('./config/database')

const cookieParser=require('cookie-parser')

//frontend PORT=3000 & Backend PORT=4000 
const cors=require('cors');
// CORS (Cross-Origin Resource Sharing) in Node.js is a mechanism that allows
//  a front-end client (such as a web browser) to make requests for resources
//  to an external back-end server. .

const {cloudinaryConnect}=require('./config/cloudinary')

const fileUpload=require('express-fileupload')


const PORT=process.env.PORT || 5000

// connect to database
database.connect();//database file me jo connect() hai vo

// middlewares
app.use(express.json())
// app.use(express.urlencoded())
app.use(cookieParser())
app.use(
    cors({
        origin:'http://localhost:3000',//path of frontEnd
        credentials:true
        //  credentials: When set to true, this allows the frontend to include
        //  credentials (such as cookies, HTTP authentication,
        //  and client-side SSL certificates) in the request.
        //  If you’re handling user sessions or authentication,
        //  you’ll likely want to set this to true.
    })
)

app.use(
    fileUpload({
        useTempFiles:true,
        // useTempFiles: This option specifies whether to use temporary files during 
        // the upload process. When set to true, the server will store the uploaded 
        // file in a temporary location (usually a directory like /tmp) before 
        // processing it further. Temporary files are useful for handling large 
        // uploads or when you need to perform additional validation or processing
        //  before saving the file permanently.

        tempFileDir:'/tmp/'
        // tempFileDir: This parameter defines the directory where temporary files will
        // be stored. In your case, it’s set to /tmp. Make sure this directory exists 
        // and has appropriate permissions for writing temporary files.
    })
)
cloudinaryConnect();//will connect to cloudinary


// routes
app.use('/api/v1/auth',userRoutes)
app.use('/api/v1/profile',profileRoutes)
app.use('/api/v1/course',courseRoutes)
app.use('/api/v1/payment',paymentRoutes)

// default route
app.get('/',(req,res)=>{
    return res.status(200).json({
        success:true,
        message:"Your Server is Up and Running"
    })
})

// activate the server
app.listen(PORT,()=>{
    console.log(`App is Running at PORT= ${PORT}`);
})