const nodemailer = require('nodemailer');

const sendEmail = async (receiver, subject, message) => {

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, 
    secure: true, 
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD, 
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: receiver,
    subject: subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error(`Failed to send email: ${error.message}`);
    throw new Error("Failed to send email.");
  }
};

module.exports = sendEmail;
