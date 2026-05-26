import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from "docx";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, category, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !category || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields" },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `Feedback_${category.replace(/\s+/g, "_")}_${timestamp}`;
    const submissionData = {
      id: filename,
      name,
      email,
      phone: phone || "Not provided",
      category,
      subject,
      message,
      submittedAt: new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "full",
        timeStyle: "long",
      }),
      timestamp,
      status: "open" as const,
    };

    // Create Word document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Title
            new Paragraph({
              text: "Customer Feedback Submission",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 400,
              },
            }),

            // Date and Time
            new Paragraph({
              children: [
                new TextRun({
                  text: `Submission Date: ${submissionData.submittedAt}`,
                  bold: false,
                  size: 20,
                }),
              ],
              spacing: { after: 300 },
            }),

            // Horizontal line
            new Paragraph({
              border: {
                bottom: {
                  color: "DC0000",
                  space: 1,
                  style: BorderStyle.SINGLE,
                  size: 6,
                },
              },
              spacing: { after: 300 },
            }),

            // Customer Information Section
            new Paragraph({
              text: "Customer Information",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Name: ",
                  bold: true,
                }),
                new TextRun({
                  text: name,
                }),
              ],
              spacing: { after: 100 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Email: ",
                  bold: true,
                }),
                new TextRun({
                  text: email,
                }),
              ],
              spacing: { after: 100 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Phone: ",
                  bold: true,
                }),
                new TextRun({
                  text: phone || "Not provided",
                }),
              ],
              spacing: { after: 300 },
            }),

            // Feedback Details Section
            new Paragraph({
              text: "Feedback Details",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Category: ",
                  bold: true,
                }),
                new TextRun({
                  text: category,
                }),
              ],
              spacing: { after: 100 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Subject: ",
                  bold: true,
                }),
                new TextRun({
                  text: subject,
                }),
              ],
              spacing: { after: 200 },
            }),

            // Message Section
            new Paragraph({
              text: "Feedback Message",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: message,
                }),
              ],
              spacing: { after: 300 },
            }),

            // Footer
            new Paragraph({
              border: {
                top: {
                  color: "DC0000",
                  space: 1,
                  style: BorderStyle.SINGLE,
                  size: 6,
                },
              },
              spacing: { before: 300, after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "This feedback was submitted through the Sunidhi Securities website feedback form.",
                  italics: true,
                  size: 18,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
        },
      ],
    });

    // Generate Word document buffer
    const docBuffer = await Packer.toBuffer(doc);

    // Save feedback locally
    const feedbackDir = path.join(process.cwd(), "feedback-submissions");
    if (!existsSync(feedbackDir)) {
      await mkdir(feedbackDir, { recursive: true });
    }

    // Save Word document
    await writeFile(
      path.join(feedbackDir, `${filename}.docx`),
      docBuffer
    );

    // Save JSON data
    await writeFile(
      path.join(feedbackDir, `${filename}.json`),
      JSON.stringify(submissionData, null, 2)
    );

    // Try to send email if SMTP is configured
    let emailSent = false;
    if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        });

        await transporter.sendMail({
          from: `"Sunidhi Securities" <${process.env.SMTP_USER}>`,
          to: "onlinetrading@sunidhi.com",
          subject: `Website Feedback: ${category} - ${subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #DC0000; border-bottom: 3px solid #DC0000; padding-bottom: 10px;">
                New Feedback Submission
              </h2>

              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">Customer Information</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
              </div>

              <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">Feedback Details</h3>
                <p><strong>Category:</strong> ${category}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Submitted:</strong> ${submissionData.submittedAt}</p>
              </div>

              <div style="background-color: #f9f9f9; padding: 20px; border-left: 4px solid #DC0000; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">Message</h3>
                <p style="white-space: pre-wrap;">${message}</p>
              </div>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
                <p>A detailed Word document is attached with this email.</p>
                <p>This feedback was submitted through the Sunidhi Securities website feedback form.</p>
              </div>
            </div>
          `,
          attachments: [
            {
              filename: `${filename}.docx`,
              content: docBuffer,
              contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            },
          ],
        });

        emailSent = true;
        console.log(`✅ Feedback email sent successfully: ${filename}`);

        // Send auto-reply to the user
        await transporter.sendMail({
          from: `"Sunidhi Securities" <${process.env.SMTP_USER}>`,
          to: email,
          subject: `We have received your feedback - Sunidhi Securities`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #DC0000; color: white; padding: 20px; text-align: center;">
                <h2>Sunidhi Securities</h2>
              </div>
              <div style="padding: 30px 20px; background-color: #f9fafb; border: 1px solid #eee;">
                <p>Dear ${name},</p>
                <p>Thank you for reaching out to us. We have successfully received your feedback regarding <strong>${subject}</strong>.</p>
                <p>Our management team is reviewing your message. If your inquiry requires a response, one of our representatives will get back to you shortly.</p>
                <p>For urgent matters, please contact us directly at <a href="mailto:onlinetrading@sunidhi.com" style="color: #DC0000;">onlinetrading@sunidhi.com</a>.</p>
                <br />
                <p>Best regards,</p>
                <p><strong>Sunidhi Securities Team</strong></p>
              </div>
            </div>
          `,
        });
        console.log(`✅ Auto-reply email sent successfully to ${email}`);
      } catch (emailError) {
        console.error("⚠️ Email sending failed, but feedback was saved locally:", emailError);
        // Don't throw error - feedback is still saved locally
      }
    }

    console.log(`✅ Feedback saved locally: ${feedbackDir}/${filename}`);

    return NextResponse.json(
      {
        message: "Feedback submitted successfully",
        saved: true,
        emailSent,
        location: `feedback-submissions/${filename}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error processing feedback:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback. Please try again later." },
      { status: 500 }
    );
  }
}
