import Contact from "../models/contactModel.js";
import nodemailer from "nodemailer";

export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Save message in MongoDB
    const savedMessage = await Contact.create({
      name,
      email,
      message,
    });

    // Nodemailer setup
    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: process.env.EMAIL_USER,

      subject: "New Contact Form Message",

      html: `
        <h2>New Contact Form Message</h2>

        <p><strong>Name:</strong> ${name}</p>

        <p><strong>Email:</strong> ${email}</p>

        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: savedMessage,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};