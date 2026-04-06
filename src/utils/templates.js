export function signupOTPTemplate(otp) {
  return `
  <div style="background:#0f0f0f;padding:20px;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table width="500" style="background:#1a1a1a;border-radius:12px;padding:25px;color:#fff;">
            
            <tr>
              <td align="center" style="font-size:24px;font-weight:bold;color:#e50914;">
                🔥 HackToFuture 3.0
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:10px 0;font-size:16px;color:#ccc;">
                Consent to join the Corps
              </td>
            </tr>

            <tr>
              <td style="padding:15px 0;text-align:center;color:#aaa;font-size:14px;">
                Your journey begins. Use the code below to complete your signup.
              </td>
            </tr>

            <tr>
              <td align="center">
                <div style="
                  background:#111;
                  border:2px solid #e50914;
                  padding:15px 25px;
                  font-size:28px;
                  letter-spacing:6px;
                  font-weight:bold;
                  color:#fff;
                  border-radius:8px;
                  display:inline-block;
                ">
                  ${otp}
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding-top:20px;text-align:center;font-size:13px;color:#888;">
                This code expires in 5 minutes.<br/>
                If this wasn’t you, ignore this message.
              </td>
            </tr>

            <tr>
              <td style="padding-top:20px;text-align:center;font-size:12px;color:#666;">
                ⚔️ “Set your heart ablaze.” – Rengoku
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
  `;
}



export function resetPasswordTemplate(otp) {
  return `
  <div style="background:#0f0f0f;padding:20px;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table width="500" style="background:#1a1a1a;border-radius:12px;padding:25px;color:#fff;">
            
            <tr>
              <td align="center" style="font-size:24px;font-weight:bold;color:#e50914;">
                Password Recovery
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:10px 0;font-size:16px;color:#ccc;">
                HackToFuture 3.0
              </td>
            </tr>

            <tr>
              <td style="padding:15px 0;text-align:center;color:#aaa;font-size:14px;">
                A breach in your defenses has been detected.<br/>
                Use the OTP below to regain control.
              </td>
            </tr>

            <tr>
              <td align="center">
                <div style="
                  background:#111;
                  border:2px solid #ff3b3b;
                  padding:15px 25px;
                  font-size:28px;
                  letter-spacing:6px;
                  font-weight:bold;
                  color:#fff;
                  border-radius:8px;
                  display:inline-block;
                ">
                  ${otp}
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding-top:20px;text-align:center;font-size:13px;color:#888;">
                This OTP expires in 10 minutes.<br/>
                If you didn’t request a reset, secure your account immediately.
              </td>
            </tr>

            <tr>
              <td style="padding-top:20px;text-align:center;font-size:12px;color:#666;">
                🩸 “Protect what matters.” 
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
  `;
}