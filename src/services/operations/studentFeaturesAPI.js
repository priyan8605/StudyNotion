import { toast } from "react-hot-toast";
import { studentEndpoints } from "../aips";
import { apiConnector } from "../apiconnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";


const {COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API} = studentEndpoints;

// function to load the script
function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true);
        }
        script.onerror= () =>{
            resolve(false);
        }
        document.body.appendChild(script);
    })
}

// buying the course
export async function BuyCourse(token, courses, userDetails, navigate, dispatch) {
    const toastId = toast.loading("Loading...");
    try{
        //1>load the script  =>got from razorpay documentation
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        // agr script load nhi hota to error show krdo
        if(!res) {
            toast.error("RazorPay SDK failed to load");
            return;
        }

        //initiate the order
        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API, 
                                {courses}//this courses is the array of courses that user wants to buy and it's passed as parameter in 
                                // BuyCourse() in courseDetails.js file, we are sending it to backend to create the order
                                ,
                                {
                                    Authorization: `Bearer ${token}`,
                                })
        // agr order create nhi hota to error show krdo
        console.log("PRINTING FULL orderResponse", orderResponse);
        console.log("PRINTING orderResponse.data", orderResponse.data);
        if(!orderResponse.data.success) {
            throw new Error(orderResponse.data.message);
        }
        console.log("PRINTING orderResponse.data.data", orderResponse.data.data);
        //options
        const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY,
            // 
            currency: orderResponse.data.data.currency,

            // understand orderResponse.data={
//   success: true,
//   data: paymentResponse
// }
            amount: `${orderResponse.data.data.amount}`,
            order_id:orderResponse.data.data.id,//razorpay order id is generated automatically by razorpay when we create the order
            name:"StudyNotion",
            description: "Thank You for Purchasing the Course",
            image:rzpLogo,
            prefill: {
                name:`${userDetails.firstName}`,
                email:userDetails.email
            },
            handler: function(response) //here response is implicitly defined by razorpay 
            {
                //send successful wala mail
                sendPaymentSuccessEmail(response, orderResponse.data.data.amount,token );
                //verifyPayment
                verifyPayment({...response, courses}, token, navigate, dispatch);
            }
        }
        //miss hogya tha 
        // open the payment gateway
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function(response) {
            toast.error("oops, payment failed");
            console.log(response.error);
        })

    }
    catch(error) {
        console.log("PAYMENT API ERROR.....", error);
        toast.error("Could not make Payment");
    }
    toast.dismiss(toastId);
}

async function sendPaymentSuccessEmail(response, amount, token) {
    try{
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.razorpay_order_id,// returned by Razorpay after payment success in response object
            paymentId: response.razorpay_payment_id,// returned by Razorpay after payment success in response object
            amount,

            // note: order_id in BuyCourse() that is defined by us for the order before checkout is different from razorpay_order_id 
            // that is returned by Razorpay after payment success in response object 
        },{
            Authorization: `Bearer ${token}`
        })
    }
    catch(error) {
        console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
    }
}

//verify payment
async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying Payment....");
    dispatch(setPaymentLoading(true));
    try{
        const response  = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
            Authorization:`Bearer ${token}`,
        })

        if(!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.success("payment Successful, ypou are addded to the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    }   
    catch(error) {
        console.log("PAYMENT VERIFY ERROR....", error);
        toast.error("Could not verify Payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}