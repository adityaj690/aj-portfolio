const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });

// Access the email credentials from environment variables
const { user, pass } = functions.config().email;

// Create a Nodemailer transporter using Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
});

const functions = require('firebase-functions');
const emailjs = require('emailjs-com');

const serviceID = functions.config().emailjs.service_id;
const templateID = functions.config().emailjs.template_id;
const userID = functions.config().emailjs.user_id;

exports.sendEmail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        const { name, email, contactno, subject, message } = req.body;

        const templateParams = {
            name,
            email,
            contactno,
            subject,
            message
        };

        emailjs.send(serviceID, templateID, templateParams, userID)
            .then(response => {
                res.status(200).send('Email sent');
            })
            .catch(error => {
                res.status(500).send(error.toString());
            });
    });
});


// Define the Cloud Function to send an email
exports.sendEmail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        const { name, email, contactno, subject, message } = req.body;

        const mailOptions = {
            from: email,
            to: user, // Your email address
            subject: `New Contact Form Submission: ${subject}`,
            html: `<p>You have a new contact form submission</p>
             <p><b>Name: </b> ${name}</p>
             <p><b>Email: </b> ${email}</p>
             <p><b>Contact No: </b> ${contactno}</p>
             <p><b>Subject: </b> ${subject}</p>
             <p><b>Message: </b> ${message}</p>`,
        };

        // Send the email
        return transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).send(error.toString());
            }
            return res.status(200).send('Email sent');
        });
    });
});
