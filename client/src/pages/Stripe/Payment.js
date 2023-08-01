import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { loadStripe } from '@stripe/stripe-js';
import AddressForm from './AddressForm';

const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

function Payment() {
  const { orderID } = useParams();
  const [stripePromise, setStripePromise] = useState(null);
  const [payments, setPayments] = useState(null);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [configResponse, paymentResponse, clientSecretResponse] =
          await Promise.all([
            axios.get(`${baseUrl}/config`),
            axios.get(`${baseUrl}/api/payment/${orderID}`),
            axios.post(`${baseUrl}/createPaymentIntent/${orderID}`, {
              orderID: orderID,
            }),
            ,
          ]);
       
        const { stripe_publishable_key } = configResponse.data;
        const { data: paymentData } = paymentResponse.data;
        const { clientSecret } = clientSecretResponse.data;

        setStripePromise(loadStripe(stripe_publishable_key));
        setPayments(paymentData);
        setClientSecret(clientSecret);
        window.scrollTo(0, 0);
      }  catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [orderID]);

  return (
    <>
     {/* <div className="flex flex-col sm:flex-row w-90%"> */}
     <div className="flex flex-col sm:flex-row w-90% justify-center">
        {/* <div className="mt-4 mb-48 sm:mb-64 w-full max-h-96 ml-10 lg:w-2.5/5 lg:ml-38"> */}
        {/* <div className="mt-4 mb-4 sm:mb-0 sm:mr-4 sm:w-1/2 max-h-96 ml-10 lg:w-2.5/5 lg:ml-38"> */}
        {/* <div className="mt-4 mb-4 sm:mb-0 sm:mr-2 sm:ml-auto sm:w-1/2 max-h-96 ml-10 lg:w-2.5/5 lg:ml-38"> */}
        <div className="mt-4 mb-4 sm:mb-0 sm:mr-10 sm:ml-10 sm:w-1/2 max-h-96 lg:w-2.5/5">
        
          <h1>Order summary</h1>
          {payments && payments.length > 0 ? (
            <table style={{ marginTop: '20px', marginBottom: '20px' }}>
              <thead>
                <tr>
                  <th style={{ width: '50%' }}>Product Name</th>
                  <th style={{ width: '20%' }}>Qty</th>
                  <th style={{ width: '20%' }}>Price</th>
                  <th style={{ width: '20%' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((paymentData) => (
                  <tr key={paymentData.order_id}>
                    <td>{paymentData.product_name}</td>
                    <td>{paymentData.quantity}</td>
                    <td>{paymentData.price}</td>
                    <td>{paymentData.price * paymentData.quantity}</td>
                  </tr>
                ))}
                <tr key="payment-summary">
                  <td
                    colSpan="4"
                    style={{ textAlign: 'right', paddingTop: '130px' }}
                  >
                    <p className="text-lg font-medium text-gray-900 justify-start">
                      Sub total: {payments[0].total_price}
                    </p>
                    <p className="text-lg font-medium text-gray-900 justify-start">
                      Shipping Method: {payments[0].shipping_method}
                    </p>
                    <p className="text-lg font-medium text-gray-900 justify-start">
                      Fee: {payments[0].fee}
                    </p>
                    <p className="text-lg font-medium text-gray-900 justify-start">
                      Pay:{' '}
                      {(
                        parseFloat(payments[0].total_price) +
                        parseFloat(payments[0].fee)
                      ).toFixed(2)}
                    </p>
                    <p className="text-lg font-medium text-gray-900 justify-start">
                      Shipping_address: {payments[0].shipping_address}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        {/* <div className="mt-4 mb-48 sm:mb-64 w-full  max-h-96 mr-10 lg:w-2.5/5 lg:ml-20"> */}
        {/* <div className="mt-4 mb-4 sm:mb-0 sm:w-1/2 max-h-96 mr-10 lg:w-2.5/5 lg:ml-20"> */}
        {/* <div className="mt-4 mb-4 sm:mb-0 sm:ml-2 sm:mr-auto sm:w-1/2 max-h-96 mr-10 lg:w-2.5/5 lg:ml-20"> */}
        <div className="mt-4 mb-4 sm:mb-0 sm:ml-10 sm:mr-10 sm:w-1/2 max-h-96 lg:w-2.5/5 mx-auto">

          {clientSecret && stripePromise && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              {/* <AddressForm /> */}

              <CheckoutForm />
            </Elements>
          )}
        </div>
      </div>
    </>
  );
}

export default Payment;
