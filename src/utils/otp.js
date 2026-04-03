import bcrypt from "bcrypt";


export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
}

export async function hashOTP(otp) {
  return await bcrypt.hash(otp, 10);
}