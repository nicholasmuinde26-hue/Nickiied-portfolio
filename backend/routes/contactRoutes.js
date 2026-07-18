import express from "express";
import nodemailer from "nodemailer";
const router = express.Router();

// POST contact form
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name ||!email ||!message) return res.status(400).json({ msg: "Name, email and message required" });

    console.log("Contact message:", { name, email, phone, subject, message });

    // Send email to yourself
    const transporter = nodemailer.createTransport({
      service: "gmail", // or "outlook", "yahoo"
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS // app password, not normal password
      }
    });

    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.VITE_EMAIL, // send to you
      subject: `New message: ${subject || "Portfolio Contact"}`,
      html: `
        <h3>New Contact Message</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || "N/A"}</p>
        <p><b>Subject:</b> ${subject || "N/A"}</p>
        <p><b>Message:</b></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ msg: "Message sent successfully ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to send message" });
  }
});

export default router;