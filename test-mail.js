import { loadEnvFile } from 'node:process';
loadEnvFile(); 

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL ,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOTP(email, otp) {
  const info = await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP",
    text: `Your OTP is ${otp}`,
  });

  console.log(info)

  console.log("OTP: ", email, otp)


  return {success: email == info.accepted[0]}
}

export async function sendOTPForResetPassoword(email, otp) {
  const info = await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP",
    text: `Your OTP for reset password is is ${otp}`,
  });
  console.log(info)

  console.log("OTP (reset passowrd): ", email, otp)

  return {success: email == info.accepted[0]}
}

sendOTP("rahulsamedavar@gmail.com", "12421")