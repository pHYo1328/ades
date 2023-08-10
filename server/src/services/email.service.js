const sendInBlue = require('../config/sendinblue');
const createHTMLContent = (customerProducts) => {
  return `<html><body><h1>This is NEW products for YOU {{params.bodyMessage}}</h1>
      ${customerProducts
        .map(
          (product) =>
            `<p>${product.product_name} is available for u</p>
            <img src="https://res.cloudinary.com/ddoajstil/image/upload/${product.image_url}" alt="Product image">
            <p>${product.description}</p>
            `
          // I will create a customized email here
        )
        .join('')}
      </body></html>`;
};

module.exports.sendEmail = (customer, customerProducts) => {
  // copy and modify from sendinblue documentation
  return sendInBlue
    .sendTransacEmail({
      subject: 'Hello from Our TechZero',
      sender: { email: 'techZero@gmail.com', name: 'techZero' },
      replyTo: { email: 'techZero@gmail.com', name: 'techZero' },
      to: [
        {
          name: `${customer.username}`,
          email: `${customer.email}`,
        },
      ],
      htmlContent: createHTMLContent(customerProducts),
      params: { bodyMessage: 'Made just for YOU!' }, // just testing
    })
    .then((data) => {
      console.log(data);
      return {
        status: 200,
        message: 'Email sent successfully',
        data: data,
      };
    });
};
