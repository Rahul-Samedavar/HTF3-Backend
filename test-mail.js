// import bcrypt from 'bcrypt'
// import { getTeamCode } from './src/utils/coder.js'

// const hash = async (msg) => await bcrypt.hash(msg, 10);
// const verify = async(msg, hash) => await bcrypt.compare(msg, hash)

// const args = process.argv.slice(2);
// args.forEach(async (msg)=>{
//         console.log(`hash of (${msg}) = ${await  hash(msg)}`)
// })



// console.log(await verify(args[0], args[1]));

// const args = process.argv.slice(2);
// args.forEach(async (id)=>{
//         console.log(`team code of (${id}) = ${await  getTeamCode(parseInt(id))}`)
// })






// testing node mailer

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
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