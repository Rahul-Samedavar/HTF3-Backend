import { pool } from "./db.js";
import { verifyOTP } from "../utils/otp.js";

export async function saveOTP(email, otpHash) {

  const client = await pool.connect();
  try{

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await client.query(
      `INSERT INTO otp_verifications (email, otp_hash, expires_at)
      VALUES ($1, $2, $3)`,
      [email, otpHash, expiresAt]
    );
    return true
  } catch(err){
    console.err("Error saving otp", err)
    return false
  }
  finally{
    client.release();
  }
}


export async function checkOTP(email, otp) {

  const client = await pool.connect();
  try{

    const result = await client.query(
      `SELECT * FROM otp_verifications
       WHERE email = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [email]
    );

    if (result.rows.length === 0) {
      return {success: false, error: "No OTP found"}
    }

    const record = result.rows[0];

    if (new Date() > record.expires_at) {
      return { success: false, error: "OTP expired" };
    }

    const isValid = await verifyOTP(otp, record.otp_hash);

    if (!isValid) {
      await client.query(
        `UPDATE otp_verifications SET attempts = attempts + 1 WHERE id = $1`,
        [record.id]
      );

      return { success: false, error: "Wrong OTP" };
    }

    return {success: true}

  } catch(err){
    console.error("Error checking otp", err)
    return {success: false, error: "Inernal Server Error"}
  }
  finally{
    client.release();
  }
}


export async function checkForPrevOTP(email) {
  try{
    const result = await pool.query(
      `SELECT * FROM otp_verifications
      WHERE email = $1
      ORDER BY created_at DESC
      LIMIT 1`,
      [email]
    );

    if (result.rows.length > 0) {
      const now = new Date();

      if (now < result.rows[0].expires_at) 
        return true
    }
    return false

  } catch(err){
    console.error("Error checking for prev otp", err)
    throw err
  }
}