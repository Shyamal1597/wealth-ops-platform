import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields" },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const submittedAt = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "long",
    });

    // Send email to onlinetrading@sunidhi.com
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error("SMTP not configured — cannot send contact form email");
      return NextResponse.json(
        { error: "Email service is not configured. Please try again later." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.office365.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Send the contact message to onlinetrading@sunidhi.com
    await transporter.sendMail({
      from: `"Sunidhi Securities" <${process.env.SMTP_USER}>`,
      to: "onlinetrading@sunidhi.com",
      subject: `Website Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #DC0000; border-bottom: 3px solid #DC0000; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>

          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          </div>

          <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Message Details</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Submitted:</strong> ${submittedAt}</p>
          </div>

          <div style="background-color: #f9f9f9; padding: 20px; border-left: 4px solid #DC0000; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Message</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            <p>This message was submitted through the Sunidhi Securities website contact form.</p>
          </div>
        </div>
      `,
    });

    console.log(`✅ Contact form email sent to onlinetrading@sunidhi.com from ${name} (${email})`);

    // Send auto-reply to the user
    await transporter.sendMail({
      from: `"Sunidhi Securities" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `We have received your message - Sunidhi Securities`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #DC0000; color: white; padding: 20px; text-align: center;">
            <h2>Sunidhi Securities</h2>
          </div>
          <div style="padding: 30px 20px; background-color: #f9fafb; border: 1px solid #eee;">
            <p>Dear ${name},</p>
            <p>Thank you for reaching out to us. We have successfully received your message regarding <strong>${subject}</strong>.</p>
            <p>Our team will review your inquiry and get back to you as soon as possible.</p>
            <p>For urgent matters, please contact us directly at <a href="mailto:onlinetrading@sunidhi.com" style="color: #DC0000;">onlinetrading@sunidhi.com</a> or call us at 022-66771601.</p>
            <br />
            <p>Best regards,</p>
            <p><strong>Sunidhi Securities Team</strong></p>
          </div>
        </div>
      `,
    });

    console.log(`✅ Auto-reply sent to ${email}`);

    return NextResponse.json(
      { message: "Message sent successfully", emailSent: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error processing contact form:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
