import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, topic, message } = req.body;

    // Create a transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_PASS, // Your Gmail app password
      },
    });

    // Email options
    const mailOptions = {
      from: email,
      to: process.env.GMAIL_USER, // Send to your own email
      subject: `New Contact Form Submission: ${topic} from ${name}`,
      text: `You have a new ${topic} submission.\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `<p>You have a new <strong>${topic}</strong> submission:</p>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong> ${message}</p>`,
    };

    try {
      // Send the email
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to send email." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
