import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import emailRoutes from "./src/routes/email";
import sgMail from "@sendgrid/mail";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", emailRoutes);

export default app;
