const chalk = require('chalk');
const pool = require('../config/database');
const sendInBlue = require('../config/sendinblue');

function generateOTP() {
  var otp = Math.floor(100000 + Math.random() * 900000);
  return otp;
}

module.exports.OTPEmailSender = async (username) => {
  console.log(chalk.blue('Cron schedule Started'));

  const userQuery = 'SELECT username, email FROM users WHERE username = ?';

  try {
    console.log('im inside try this is my unsername', username);
    const result = await pool.query(userQuery, [username]);
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
          const otp = generateOTP(); // Generate OTP

          // Save the OTP in the database for the user
          await pool.query('UPDATE users SET otp = ? WHERE username = ?', [
            otp,
            username,
          ]);

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
            htmlContent: `<html><body><h1>This is your OTP ${otp}</h1></body></html>`,
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
