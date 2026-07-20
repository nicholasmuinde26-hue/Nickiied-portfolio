import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message, phone } = req.body;
    if (!name || !email || !message) return res.status(400).json({ msg: "Missing required fields" });

    // Optional: send email to yourself
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });
      await transporter.sendMail({
        from: `"${name}" <${email}>`,
        to: process.env.EMAIL_USER,
        subject: subject || "New Portfolio Message",
        html: `<p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Phone:</b> ${phone}</p><p><b>Message:</b> ${message}</p>`
      });
    }

    res.json({ msg: "Message sent successfully ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to send message" });
  }
});

export default router;