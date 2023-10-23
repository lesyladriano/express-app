import * as nodemailer from 'nodemailer';
require ('dotenv').config();


export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_MAILER,
        pass: process.env.SMTP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false, // Ignore SSL certificate errors
    },
});
