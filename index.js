import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
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
    console.error("❌ Failed to send email", error.response?.body || error);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
