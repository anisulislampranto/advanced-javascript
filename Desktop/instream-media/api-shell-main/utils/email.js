const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const pug = require('pug');

module.exports = async ({ to,
  from = `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
  subject,
  data,
  template } = {}) => {

  // 1) Render HTML based on a pug template
  const html = pug.renderFile(`${__dirname}/../../emailTemplates/pug/${template}.pug`, data);


  // 2) Define email options
  const mailOptions = {
    from,
    to,
    subject,
    html,
    text: htmlToText.fromString(html)
  };

  // 3) Create a transport and send email
  await newTransport().sendMail(mailOptions);
}

function newTransport() {
  if (process.env.NODE_ENV === 'production') {
    // Sendgrid
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD
      }
    });
  }
  // Fake Email Trap for development
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
}
