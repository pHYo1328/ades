const chalk = require('chalk');
const pool = require('../config/database');
const sendInBlue = require('../config/sendinblue');
const baseUrl = process.env.REACT_APP_DOMAIN_BASE_URL;

module.exports.AdminForgotPasswordEmailSender = async (email) => {
  console.log(chalk.blue('Cron schedule Started'));

  const emailQuery = 'SELECT username, email FROM admin WHERE email = ?';

  try {
    console.log('im trying to send admin forgot password email', email);
    const result = await pool.query(emailQuery, [email]);
    console.log('Result:', result[0]);
    const rows = result[0]; // Access the rows returned from the query
    console.log('Rows:', rows);
    if (rows.length > 0) {
      // Process each row
      const response = await Promise.all(
        rows.map(async (row) => {
          const users = row;
          const username = users.username;
          const email = users.email;

          // Send the OTP email using Sendinblue
          const data = await sendInBlue.sendTransacEmail({
            subject: 'Hello from Our TechZero',
            sender: { email: 'techZero@gmail.com', name: 'techZero' },
            replyTo: { email: 'techZero@gmail.com', name: 'techZero' },
            to: [
              {
                name: username,
                email: email,
              },
            ],
            htmlContent: `<html><body><h1>Click this <a href="${baseUrl}/forgot-admin">link</a> to change admin's password.</h1></body></html>`,
            params: { bodyMessage: 'Made just for you!' },
          });

          console.log(data);
          return {
            status: 200,
            message: 'Email sent successfully',
            data: data,
          };
        })
      );

      return response;
    }
  } catch (error) {
    console.error(error);
  }
};
