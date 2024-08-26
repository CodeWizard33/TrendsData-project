const nodemailer = require('nodemailer');

exports.sendEmail = (payload, flag = true) => {
    if (flag) {

        // Create a transporter object
        const transport = nodemailer.createTransport({
            // host: "sandbox.smtp.mailtrap.io",
            // port: 2525,
            secure: false,
            service: 'gmail',
            auth: {
                user: 'larryfarm30005@gmail.com',
                pass: 'zgqpyogixiblcvvu'

            }
        });

        // Configure the mailoptions object
        const mailOptions = {
            from: 'practiceAuth@gmail.com',
            to: payload.email,
            subject: 'Confirmation Message',
            text: 'Your Account has been created successfully.',

        };

        // Send the email
        return transport.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('Error:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
    }
    else {
        // Create a transporter object
        const transport = nodemailer.createTransport({
            // host: "sandbox.smtp.mailtrap.io",
            // port: 2525,
            secure: false,
            service: 'gmail',
            auth: {
                user: 'larryfarm30005@gmail.com',
                pass: 'zgqpyogixiblcvvu'

            }
        });

        // Configure the mailoptions object
        const mailOptions = {
            from: 'practiceAuth@gmail.com',
            to: payload.email,
            subject: 'password reset Link',
            html: `<div>Click on the link to reset password and token = ${payload.token}</div>`,
        };

        // Send the email
        return transport.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('Error:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
    }

}