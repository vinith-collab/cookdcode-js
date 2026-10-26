import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logoPath = path.resolve(__dirname, '../../Images/logo.png');

/**
 * Creates the appropriate Nodemailer transporter based on environment config.
 */
function createTransporter() {
  const rawUser = process.env.SMTP_USER || process.env.GMAIL_USER;
  const rawPass = process.env.SMTP_PASS || process.env.GMAIL_PASS;
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465;

  if (rawUser && rawPass) {
    const user = rawUser.trim();
    // Google App Passwords often have spaces (e.g. 'xxxx xxxx xxxx xxxx'), remove them
    const pass = rawPass.replace(/\s+/g, '').trim();

    if (host.includes('gmail') || user.endsWith('@gmail.com')) {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass }
      });
    }
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }

  return null;
}

/**
 * Sends a password reset OTP to the specified email address.
 * @param {string} toEmail 
 * @param {string|number} otp 
 * @returns {Promise<{success: boolean, previewUrl?: string, mode: string}>}
 */
export async function sendOtpEmail(toEmail, otp) {
  const transporter = createTransporter();

  const attachments = [];
  if (fs.existsSync(logoPath)) {
    attachments.push({
      filename: 'logo.png',
      path: logoPath,
      cid: 'cookdcode-logo'
    });
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; }
        .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 36px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
        .brand { text-align: center; margin-bottom: 24px; }
        .brand-text { font-size: 24px; font-weight: 800; color: #3a86cc; letter-spacing: -0.5px; }
        h2 { color: #0f172a; font-size: 20px; font-weight: 700; margin-bottom: 8px; text-align: center; }
        p { color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 24px; }
        .otp-box { background: linear-gradient(135deg, #f0f7ff 0%, #e0effe 100%); border: 2px dashed #3a86cc; border-radius: 12px; padding: 20px; text-align: center; margin: 28px 0; }
        .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #1e40af; font-family: monospace; }
        .note { font-size: 13px; color: #64748b; text-align: center; margin-top: 8px; }
        .footer { text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="brand">
          <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
            <tr>
              <td style="vertical-align: middle; padding-right: 10px;">
                <img src="cid:cookdcode-logo" alt="CookDCode" width="40" height="40" style="width: 40px; height: 40px; display: block; object-fit: contain; border: 0;" />
              </td>
              <td style="vertical-align: middle;">
                <span class="brand-text">CookDCode</span>
              </td>
            </tr>
          </table>
        </div>
        <h2>Password Reset Verification</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password for your CookDCode account. Use the verification code below to complete the reset process:</p>
        
        <div class="otp-box">
          <div class="otp-code">${otp}</div>
          <div class="note">Valid for 10 minutes. Do not share this code with anyone.</div>
        </div>

        <p>If you didn't request a password reset, you can safely ignore this email.</p>

        <div class="footer">
          &copy; ${new Date().getFullYear()} CookDCode Inc. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  if (transporter) {
    try {
      const fromAddr = process.env.SMTP_FROM || process.env.SMTP_USER || process.env.GMAIL_USER || 'no-reply@cookdcode.com';
      const info = await transporter.sendMail({
        from: `"CookDCode" <${fromAddr}>`,
        to: toEmail,
        subject: `[CookDCode] Your Password Reset OTP is ${otp}`,
        text: `Your CookDCode password reset verification code is: ${otp}. It will expire in 10 minutes.`,
        html: htmlContent,
        attachments
      });

      console.log(`[Email Service] Sent OTP email to ${toEmail} (Message ID: ${info.messageId})`);
      return { success: true, mode: 'smtp', messageId: info.messageId };
    } catch (err) {
      console.error(`[Email Service] Failed sending via configured SMTP:`, err.message);
      // Fallback to simulated mode below
    }
  }

  // If no SMTP configured, or SMTP send failed, generate an Ethereal test message or simulated message
  try {
    const testAccount = await nodemailer.createTestAccount();
    const testTransporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });

    const info = await testTransporter.sendMail({
      from: '"CookDCode Security" <security@cookdcode.com>',
      to: toEmail,
      subject: `[CookDCode] Your Password Reset OTP is ${otp}`,
      text: `Your CookDCode verification code is: ${otp}`,
      html: htmlContent,
      attachments
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`\n======================================================`);
    console.log(`[Email Service - Dev Mode] OTP for ${toEmail}: ${otp}`);
    if (previewUrl) {
      console.log(`[Email Service - Preview] ${previewUrl}`);
    }
    console.log(`======================================================\n`);

    return {
      success: true,
      mode: 'ethereal',
      previewUrl: previewUrl || null,
      otp: String(otp)
    };
  } catch (testErr) {
    console.log(`\n======================================================`);
    console.log(`[Email Service - Local Fallback] OTP for ${toEmail}: ${otp}`);
    console.log(`======================================================\n`);
    return {
      success: true,
      mode: 'local',
      otp: String(otp)
    };
  }
}
