import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendMail = async (to: string, subject: string, html: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "transportes@afogados.ifpe.edu.br",
        pass: process.env.MAIL_SECRET_KEY,
      },
    });

    const mailOptions = {
      from: "transportes@afogados.ifpe.edu.br", // sender address
      to, // receiver (use array of string for a list)
      subject, // Subject line
      html: `<p>${html}</p>`, // plain text body
    };
    let mail = await transporter.sendMail(mailOptions);
    console.log("MAIL: ", mail);
  } catch (err) {}
};
