// src/app/api/admin/email-certificate/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, studentName, courseName, grade, rollNo, verifyUrl, pdfBase64 } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: "Invalid or missing email" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Srilal Computer Institute" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🎓 Your Certificate is Ready — ${studentName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Srilal CSC — Certificate</title>
        </head>
        <body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',system-ui,-apple-system,sans-serif;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f8fafc;padding:24px 0;">
            <tr>
              <td align="center">
                <table role="presentation" cellpadding="0" cellspacing="0" width="480" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#0a1628 0%,#1a3a5c 100%);padding:32px 24px;text-align:center;position:relative;">
                      <h1 style="margin:0;font-family:Georgia,serif;font-size:1.6rem;color:#f4e4a6;">🏛️ Srilal Computer Institute</h1>
                      <p style="margin:6px 0 0;color:#94a3b8;font-size:0.85rem;">Shambhuganj, Jaunpur, Uttar Pradesh</p>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:28px 24px;">
                      <p style="margin:0 0 16px;color:#334155;font-size:0.95rem;line-height:1.6;">
                        Namaste <strong>${studentName}</strong> 🙏,<br><br>
                        Congratulations! You have successfully completed your training. Your official certificate is attached to this email.
                      </p>

                      <div style="background:#f1f5f9;border-radius:12px;padding:16px;margin-bottom:20px;">
                        <p style="margin:0 0 8px;color:#475569;font-size:0.8rem;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Course Details</p>
                        <ul style="margin:0;padding:0;list-style:none;color:#1e293b;font-size:0.9rem;line-height:1.8;">
                          <li><strong>Course:</strong> ${courseName}</li>
                          <li><strong>Grade:</strong> <span style="color:#15803d;font-weight:bold;">${grade || "—"}</span></li>
                          <li><strong>Roll Number:</strong> <span style="font-family:monospace;color:#b8941f;font-weight:bold;">${rollNo}</span></li>
                        </ul>
                      </div>

                      <p style="margin:0 0 20px;color:#334155;font-size:0.9rem;line-height:1.6;">
                        You can also verify the authenticity of this certificate at any time using our official verification portal.
                      </p>

                      <div style="text-align:center;margin-bottom:24px;">
                        <a href="${verifyUrl}" style="display:inline-block;background:#1a3a5c;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:0.9rem;">Verify Certificate Online</a>
                      </div>

                      <p style="margin:0;color:#64748b;font-size:0.8rem;line-height:1.5;">
                        We wish you the very best in your future endeavors!<br>
                        <em>— Team Srilal Computer Institute (SCI)</em>
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background:#f8fafc;padding:16px 24px;text-align:center;border-top:1px solid #e2e8f0;">
                      <p style="margin:0;color:#94a3b8;font-size:0.7rem;">
                        © ${new Date().getFullYear()} Srilal Computer Institute (SCI)<br>
                        Shambhuganj, Jaunpur — 222132, Uttar Pradesh
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: `Certificate_${rollNo}.pdf`,
          // pdfBase64 comes as a Data URI (data:application/pdf;base64,JVBERi...), Nodemailer handles this string automatically
          path: pdfBase64, 
        },
      ],
    });

    return NextResponse.json({ success: true, message: "Certificate emailed successfully" });
  } catch (err: any) {
    console.error("Email Certificate Error:", err);
    return NextResponse.json({ success: false, message: "Failed to send certificate email" }, { status: 500 });
  }
}