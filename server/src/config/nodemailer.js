const nodemailer = require('nodemailer');
const config = require('../config/config');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: `${config.smtp_email}`,
      pass: `${config.smtp_password}`,
    },
  });
module.exports = transporter;