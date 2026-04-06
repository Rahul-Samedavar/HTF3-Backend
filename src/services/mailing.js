import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 8000,
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


// import fetch from "node-fetch";
// import { resetPasswordTemplate, signupOTPTemplate } from "../utils/templates.js";

// const GSCRIPT_URL = process.env.GSCRIPT_URL;
// const GSCRIPT_SECRET = process.env.GSCRIPT_SECRET;

// async function sendEmail(to, subject, text, html) {
//   const controller = new AbortController();
//   const timeout = setTimeout(() => controller.abort(), 10000);

//   try {
//     const res = await fetch(GSCRIPT_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       signal: controller.signal,
//       body: JSON.stringify({
//         to,
//         subject,
//         body:text,
//         html,
//         secret: GSCRIPT_SECRET,
//       }),
//     });

//     const data = await res.json();

//     if (!data.success) {
//       throw new Error("Email failed");
//     }

//     return { success: true };

//   } catch (err) {
//     console.error("Email error:", err.message);
//     return { success: false };
//   } finally {
//     clearTimeout(timeout);
//   }
// }

// export async function sendOTP(email, otp) {
//   console.log("OTP:", email, otp);

//   const html = signupOTPTemplate(otp)

//   return await sendEmail(
//     email,
//     "OTP Verification",
//     null,
//     html
//   );
// }

// export async function sendOTPForResetPassoword(email, otp) {
//   console.log("OTP (reset password):", email, otp);

//   const html = resetPasswordTemplate(otp)

//   return await sendEmail(
//     email,
//     "OTP Verification",
//     null,
//     html
//   );
// }