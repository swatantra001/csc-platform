// import { NextRequest, NextResponse } from "next/server";
// import { supabaseAdmin } from "@/lib/supabase";
// import nodemailer from "nodemailer";

// export async function POST(req: NextRequest) {
//   try {
//     const { email } = await req.json();
//     if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       return NextResponse.json({ success: false, message: "Invalid email" }, { status: 400 });
//     }

//     // 1. Generate 6-digit OTP and expiry (10 mins)
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const expiresAt = new Date(Date.now() + 10 * 60000).toISOString();

//     // 2. Check if user exists, if not create a temporary entry
//     const { data: user } = await supabaseAdmin.from("users").select("id").eq("email", email).single();
    
//     if (user) {
//       await supabaseAdmin.from("users").update({ otp_code: otp, otp_expires_at: expiresAt }).eq("id", user.id);
//     } else {
//       await supabaseAdmin.from("users").insert([{ 
//         email, role: "user", preferred_lang: "hi", otp_code: otp, otp_expires_at: expiresAt 
//       }]);
//     }

//     // 3. Send Email using Nodemailer
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_APP_PASSWORD,
//       },
//     });

//     await transporter.sendMail({
//       from: `"Shrilal CSC" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Your Login OTP - Shrilal CSC",
//       html: `
//         <div style="font-family: sans-serif; padding: 20px; text-align: center;">
//           <h2>Shrilal CSC Portal</h2>
//           <p>Your OTP for login is:</p>
//           <h1 style="color: #4338ca; letter-spacing: 5px;">${otp}</h1>
//           <p style="color: #666; font-size: 12px;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
//         </div>
//       `,
//     });

//     return NextResponse.json({ success: true, message: "OTP sent successfully" });
//   } catch (err: any) {
//     console.error("Email OTP Error:", err);
//     return NextResponse.json({ success: false, message: "Failed to send email" }, { status: 500 });
//   }
// }












import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: "Invalid email" }, { status: 400 });
    }

    // 1. Generate 6-digit OTP and expiry (10 mins)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60000).toISOString();

    // 2. Check if user exists, if not create a temporary entry
    const { data: user } = await supabaseAdmin.from("users").select("id").eq("email", email).single();
    
    if (user) {
      await supabaseAdmin.from("users").update({ otp_code: otp, otp_expires_at: expiresAt }).eq("id", user.id);
    } else {
      await supabaseAdmin.from("users").insert([{ 
        email, role: "user", preferred_lang: "hi", otp_code: otp, otp_expires_at: expiresAt 
      }]);
    }

    // 3. Send Email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Shrilal CSC — Shambhuganj, Jaunpur" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Your Login OTP — Shrilal CSC Portal",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Shrilal CSC — Login OTP</title>
        </head>
        <body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',system-ui,-apple-system,sans-serif;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f8fafc;padding:24px 0;">
            <tr>
              <td align="center">
                <table role="presentation" cellpadding="0" cellspacing="0" width="480" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#1e3a8a 0%,#312e81 60%,#4338ca 100%);padding:32px 24px;text-align:center;position:relative;">
                      <div style="position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,0.06) 1px,transparent 1px);background-size:20px 20px;"></div>
                      <h1 style="margin:0;font-family:Georgia,serif;font-size:1.6rem;color:#ffffff;position:relative;">🏛️ Shrilal CSC</h1>
                      <p style="margin:6px 0 0;color:#c7d2fe;font-size:0.85rem;position:relative;">Block Operator — Shambhuganj, Jaunpur, Uttar Pradesh</p>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:28px 24px;">
                      <p style="margin:0 0 16px;color:#334155;font-size:0.95rem;line-height:1.6;">
                        Namaste 🙏,<br><br>
                        You are logging into the <strong>Shrilal CSC Portal</strong>, your trusted Common Service Center at 
                        <strong>Shambhuganj, Jaunpur</strong>. We have been serving our community with dedication for years, 
                        helping citizens with government services, online forms, document work, and digital payments.
                      </p>

                      <div style="background:#f1f5f9;border-radius:12px;padding:16px;margin-bottom:20px;">
                        <p style="margin:0 0 8px;color:#475569;font-size:0.8rem;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Your One-Time Password</p>
                        <div style="background:#ffffff;border:2px solid #e2e8f0;border-radius:10px;padding:16px;text-align:center;">
                          <span style="font-family:'Courier New',monospace;font-size:2rem;font-weight:800;color:#1e3a8a;letter-spacing:8px;">${otp}</span>
                        </div>
                        <p style="margin:10px 0 0;color:#94a3b8;font-size:0.75rem;text-align:center;">Valid for 10 minutes • Do not share with anyone</p>
                      </div>

                      <p style="margin:0 0 12px;color:#334155;font-size:0.9rem;">
                        <strong>What we do at Shrilal CSC:</strong>
                      </p>
                      <ul style="margin:0 0 20px;padding-left:20px;color:#475569;font-size:0.85rem;line-height:1.8;">
                        <li>Online Government Form Filling (UP Scholarship, Pension, Ration Card, etc.)</li>
                        <li>Aadhaar / PAN Card related services</li>
                        <li>Document Printing, Scanning, Photocopy & Lamination</li>
                        <li>Money Transfer & Online Payments</li>
                        <li>Train / Bus / Flight Ticket Booking</li>
                        <li>Digital Photo & Document Work</li>
                      </ul>

                      <div style="background:#fefce8;border:1px solid #fde68a;border-radius:10px;padding:12px 16px;margin-bottom:20px;">
                        <p style="margin:0;color:#92400e;font-size:0.8rem;line-height:1.5;">
                          <strong>⚠️ Security Tip:</strong> Shrilal CSC will never ask for your OTP over phone or WhatsApp. 
                          This code is only for your login. If you did not request this, please ignore this email.
                        </p>
                      </div>

                      <p style="margin:0;color:#64748b;font-size:0.8rem;line-height:1.5;">
                        Need help? Visit us at <strong>Shambhuganj, Jaunpur, UP</strong> or call our support line.<br>
                        <em>— Team Shrilal CSC</em>
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background:#f8fafc;padding:16px 24px;text-align:center;border-top:1px solid #e2e8f0;">
                      <p style="margin:0;color:#94a3b8;font-size:0.7rem;">
                        © 2026 Shrilal CSC, Shambhuganj, Jaunpur • Common Service Center<br>
                        Authorized Block Operator | Govt. of Uttar Pradesh
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
    });

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (err: any) {
    console.error("Email OTP Error:", err);
    return NextResponse.json({ success: false, message: "Failed to send email" }, { status: 500 });
  }
}