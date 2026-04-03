export async function saveOTP(client, email, otpHash) {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await client.query(
    `INSERT INTO otp_verifications (email, otp_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [email, otpHash, expiresAt]
  );
}