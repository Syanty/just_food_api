const nodemailer = require("nodemailer")

const HOST_URL = process.env.HOST_URL
const user = process.env.SENDER
const pass = process.env.PASS


const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: user,
        pass: pass,
    },
});


module.exports.sendConfirmationEmail = (email, confirmationCode) => {
    transport.sendMail({
        from: user,
        to: email,
        subject: "Please confirm your account",
        html: `<h1>Email Confirmation</h1>
          <h2>Hello ${email}</h2>
          <p>Thank you for joining. Please confirm your email by clicking on the following link</p>
          <a href='${HOST_URL}/account/confirm/${confirmationCode}'> Click here</a>
          <p>If you didn't sign up for this, just ignore this email.</p>`,
    }).catch(err => console.log(err));
};