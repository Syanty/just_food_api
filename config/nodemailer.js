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
          <a target="_blank" href=${HOST_URL}/account/confirm/${confirmationCode}> Click here</a>
          <p>If you didn't sign up for this, just ignore this email.</p>`,
    }).catch(err => console.log(err));
};

module.exports.sendResetPasswordEmail = (email, resetCode) => {
    transport.sendMail({
        from: user,
        to: email,
        subject: "Reset password link",
        html: `<h1>Reset Password</h1>
          <h2>Hello ${email}</h2>
          <p>A request has been received to change password for your Just Food account</p>
          <a target="_blank" href=${HOST_URL}/account/reset-password/${resetCode}> Reset Password</a>
          <p>If you didn't initiate this request, please contact us immediately at <a href = "mailto: justfood.nepal@gmail.com">justfood.nepal@gmail.com</a> </p>`,
    }).catch(err => console.log(err));
};

