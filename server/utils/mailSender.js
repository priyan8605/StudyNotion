const express = require('express');
const nodemailer=require('nodemailer')

// we have written mailSender function so that we can send OTP inside a MAIL
const mailSender=async(email,title,body)=>{
    try
    {
        // 1> Creating Transporter
         let transport=nodemailer.createTransport({
            host:process.env.MAIL_HOST,
             port: 465, // SSL port
      secure: true,     
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
         });

         let info=await transport.sendMail({
            from:`"Studynotion | CodeHelp" <${process.env.MAIL_USER}>`,
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
         })
         console.log(`info is = ${info}`);
         return info;
    }
    catch(error)
    {
     console.log(error.message);
    }
}
module.exports=mailSender