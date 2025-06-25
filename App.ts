import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import emailRoutes from "./src/routes/email";
import sgMail from "@sendgrid/mail";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const App = express();

App.use(cors());
App.use(express.json());

App.use("/api", emailRoutes);

export default App;
