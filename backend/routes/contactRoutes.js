import express from "express";
import { Resend } from "resend";
import Contact from "../models/Contact.js";
import dotenv from "dotenv"; // <- ADD
dotenv.config(); // <- ADD

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

console.log("RESEND KEY LOADED:", !!process.env.RESEND_API_KEY); // <- for debugging

router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message, phone } = req.body;
    if (!name || !email || !message) 
      return res.status(400).json({ msg: "Missing required fields" });

    // 1. Save to MongoDB first
    const newContact = await Contact.create({ name, email, phone, subject, message });
    console.log("Contact saved to DB:", newContact._id);

    // 2. Send email via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const data = await resend.emails.send({
          from: "Portfolio <onboarding@resend.dev>",
          to: process.env.EMAIL_USER, // send to yourself
          reply_to: email,
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
        console.log("Email sent successfully via Resend:", data.id);
      } catch(emailErr) {
        console.error("Email failed but contact saved:", emailErr.message);
      }
    } else {
      console.error("RESEND_API_KEY is missing in env");
    }

    res.status(200).json({ msg: "Message sent successfully ✅", data: newContact });
  } catch (err) {
    console.error("Contact route error:", err);
    res.status(500).json({ msg: "Failed to save message" });
  }
});

export default router;