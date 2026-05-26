import nodemailer from "nodemailer";

// Validate SMTP configuration
function validateSMTPConfig(): { isValid: boolean; error?: string } {
  if (!process.env.SMTP_USER || process.env.SMTP_USER === "your-email@gmail.com") {
    return { isValid: false, error: "SMTP_USER not configured in .env.local" };
  }
  if (!process.env.SMTP_PASSWORD || process.env.SMTP_PASSWORD === "your-app-password-here") {
    return { isValid: false, error: "SMTP_PASSWORD not configured in .env.local" };
  }
  return { isValid: true };
}

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  try {
    // Validate SMTP configuration before attempting to send
    const validation = validateSMTPConfig();
    if (!validation.isValid) {
      console.error("❌ EMAIL ERROR:", validation.error);
      console.error("   Please configure SMTP settings in .env.local file");
      console.error("   SMTP_USER and SMTP_PASSWORD must be set with valid credentials");
      return false;
    }

    console.log("📧 Attempting to send email to:", options.to);
    console.log("   From:", process.env.SMTP_USER);
    console.log("   Host:", process.env.SMTP_HOST);
    console.log("   Port:", process.env.SMTP_PORT);

    await transporter.sendMail({
      from: `"Sunidhi Securities" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html || options.text,
    });

    console.log("✅ Email sent successfully to:", options.to);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    if (error instanceof Error) {
      console.error("   Error message:", error.message);
    }
    return false;
  }
}

export async function sendAdminCredentials(
  email: string,
  username: string,
  password: string,
  fullName: string
): Promise<boolean> {
  const subject = "Your Sunidhi Admin Account Credentials";
  const text = `
Hello ${fullName},

Your admin account has been created for the Sunidhi Securities website.

Login Credentials:
- Username: ${username}
- Email: ${email}
- Password: ${password}

Login URL: ${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/admin/login

Please keep these credentials secure and do not share them with anyone.
For security reasons, we recommend changing your password after your first login.

Best regards,
Sunidhi Securities Admin Team
  `;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #1e40af; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9fafb; }
    .credentials { background-color: white; padding: 15px; border-left: 4px solid #1e40af; margin: 20px 0; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
    .button { display: inline-block; background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Sunidhi Securities</h1>
      <p>Admin Portal Access</p>
    </div>
    <div class="content">
      <h2>Hello ${fullName},</h2>
      <p>Your admin account has been created for the Sunidhi Securities website.</p>

      <div class="credentials">
        <h3>Login Credentials:</h3>
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
      </div>

      <p style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/admin/login" class="button">
          Login to Admin Portal
        </a>
      </p>

      <p><strong>Important:</strong></p>
      <ul>
        <li>Please keep these credentials secure and do not share them with anyone.</li>
        <li>For security reasons, we recommend changing your password after your first login.</li>
      </ul>
    </div>
    <div class="footer">
      <p>This is an automated message from Sunidhi Securities Admin System.</p>
      <p>&copy; ${new Date().getFullYear()} Sunidhi Securities & Finance Limited. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({ to: email, subject, text, html });
}

export async function sendAdminApprovalRequest(
  superAdminEmail: string,
  requestedAdminData: {
    username: string;
    email: string;
    fullName: string;
    requestedPermissions: string[];
  }
): Promise<boolean> {
  const subject = "New Admin Account Approval Request";
  const text = `
New Admin Account Approval Request

A new admin account has been requested with the following details:

Full Name: ${requestedAdminData.fullName}
Username: ${requestedAdminData.username}
Email: ${requestedAdminData.email}
Requested Permissions: ${requestedAdminData.requestedPermissions.join(", ")}

Please log in to the admin portal to approve or reject this request.

Login URL: ${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/admin/login
  `;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9fafb; }
    .request-details { background-color: white; padding: 15px; border-left: 4px solid #dc2626; margin: 20px 0; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
    .button { display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Admin Approval Required</h1>
      <p>New Admin Account Request</p>
    </div>
    <div class="content">
      <h2>New Admin Account Requested</h2>
      <p>A new admin account has been requested and requires your approval.</p>

      <div class="request-details">
        <h3>Request Details:</h3>
        <p><strong>Full Name:</strong> ${requestedAdminData.fullName}</p>
        <p><strong>Username:</strong> ${requestedAdminData.username}</p>
        <p><strong>Email:</strong> ${requestedAdminData.email}</p>
        <p><strong>Requested Permissions:</strong></p>
        <ul>
          ${requestedAdminData.requestedPermissions.map((p) => `<li>${p}</li>`).join("")}
        </ul>
      </div>

      <p style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/admin/login" class="button">
          Review Request
        </a>
      </p>
    </div>
    <div class="footer">
      <p>This is an automated message from Sunidhi Securities Admin System.</p>
      <p>&copy; ${new Date().getFullYear()} Sunidhi Securities & Finance Limited. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({ to: superAdminEmail, subject, text, html });
}

export async function sendActivationOTP(email: string, otp: string, name: string): Promise<boolean> {
  const subject = "Your Sunidhi Security Activation Code";
  const text = `
Hello ${name},

To complete your activation on the new Sunidhi Next.js Portal, please use the following 6-digit OTP code:

${otp}

This code will expire in 10 minutes. Please do not share this code with anyone.

Best regards,
Sunidhi Tech Team
  `;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #1e40af; color: white; padding: 20px; text-align: center; }
    .content { padding: 30px 20px; background-color: #f9fafb; text-align: center; }
    .otp { font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e40af; background: #e0e7ff; padding: 15px; border-radius: 8px; margin: 20px display: inline-block; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Sunidhi Securities</h1>
      <p>Account Security Activation</p>
    </div>
    <div class="content">
      <h2>Hello ${name},</h2>
      <p>To safely activate your account on our new portal, please enter the following One-Time Password (OTP):</p>
      
      <div class="otp">${otp}</div>
      
      <p><em>This code is valid for exactly 10 minutes. Please do not share it with anyone.</em></p>
    </div>
    <div class="footer">
      <p>Automated message from Sunidhi Securities & Finance Limited.</p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: email,
    subject,
    text,
    html
  });
}
