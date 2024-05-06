require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Enable CORS for all origins
app.use(cors());

// Route to handle sending emails
app.post('/send-emails', (req, res) => {
    const { subject, msg, emails } = req.body;
    // console.log(emails);

    // Email sending logic
    const transporter = nodemailer.createTransport({
        // Configure your email service here
        service: 'Gmail',
        secure: true,
        port: 465,
        auth: {
            user: process.env.USER,
            pass: process.env.F_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.USER,
        to: emails.join(','),
        subject: subject,
        text: msg
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).send('Failed to send emails');
        } else {
            console.log('Emails sent:', info.response);
            res.status(200).send('Emails sent successfully');
        }
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});