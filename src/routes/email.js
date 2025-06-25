import { Router } from "express";
import sgMail from "@sendgrid/mail";
import validator from "validator";

const router = Router();

router.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email address." });
  }

  const msg = {
    to: process.env.TO_EMAIL,
    from: process.env.EMAIL_USER,
    subject: `New message from ${name}`,
    html: `
      <h2>New Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
    replyTo: email,
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Email sent to: ${process.env.TO_EMAIL}`);
    res.status(200).json({ success: true, message: "Email sent!" });
  } catch (error) {
    console.error(
      "❌ Email send error:",
      error.response?.body || error.message || error
    );
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
});

export default router;
