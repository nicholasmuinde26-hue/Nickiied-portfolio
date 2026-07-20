import express from "express";
import nodemailer from "nodemailer";
import Contact from "../models/Contact.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message, phone } = req.body;
    if (!name || !email || !message) 
      return res.status(400).json({ msg: "Missing required fields" });

    // 1. Save to MongoDB first
    const newContact = await Contact.create({ name, email, phone, subject, message });
    console.log("Contact saved to DB:", newContact._id); // <- helps debug in Render logs

    // 2. Send email to yourself - with error catch so DB still saves if email fails
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: { 
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS // this must be 16-char App Password, no spaces
          }
        });
        
        await transporter.verify(); // <- ADD THIS: tests connection before sending

        await transporter.sendMail({
          from: `"${name} via Portfolio" <${process.env.EMAIL_USER}>`, // Gmail requires your gmail here
          replyTo: email, // so you can hit reply and it goes to them
          to: process.env.EMAIL_USER,
          subject: subject || "New Portfolio Message",
          html: `
            <h3>New Contact Form Submission</h3>
            <p><b>Name:</b> ${name}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Phone:</b> ${phone || 'N/A'}</p>
            <p><b>Subject:</b> ${subject}</p>
            <p><b>Message:</b> ${message}</p>
          `
        });
        console.log("Email sent successfully to:", process.env.EMAIL_USER);
      } catch(emailErr) {
        console.error("Email failed but contact saved:", emailErr.message);
        // Don't return error to user. We already saved to DB
      }
    } else {
      console.warn("EMAIL_USER or EMAIL_PASS not set. Skipping email.");
    }

    res.status(200).json({ msg: "Message sent successfully ✅", data: newContact });
  } catch (err) {
    console.error("Contact route error:", err);
    res.status(500).json({ msg: "Failed to save message" });
  }
});

export default router;