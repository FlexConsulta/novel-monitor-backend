import nodemailer from 'nodemailer';
import Handlebars from "handlebars";
import fs from "fs";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true, // upgrade later with STARTTLS
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendMail = async (to, subject, variables, path) => {

    const templateFileContent = fs.readFileSync(path).toString("utf-8");
    const templateParse = Handlebars.compile(templateFileContent);
    const templateHTML = templateParse(variables);

    await transporter.sendMail({
        to,
        from: "no-reply@novelconsultoria.com.br",
        subject,
        html: templateHTML
    })


}

export default sendMail;