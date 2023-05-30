import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import api from '../../index';
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
        console.log(parseInt(orderID));
        const { stripe_publishable_key } = configResponse.data;
        const { data: paymentData } = paymentResponse.data;
        const { clientSecret } = clientSecretResponse.data;

        setStripePromise(loadStripe(stripe_publishable_key));
        setPayments(paymentData);
        setClientSecret(clientSecret);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [orderID]);

  return (
    <>
    <div className="flex flex-row">
      <div className="mt-4 mb-48 sm:mb-64 w-full ml-4 lg:w-2/5 lg:ml-40">
      <h1>Order summary</h1>
      {payments && payments.length > 0 ? (
        <>
          {payments.map((paymentData) => (
            <div key={paymentData.order_id} className="group relative">
              <div>{paymentData.product_name}</div>
              <div>
              <p className="text-sm font-medium text-gray-900 justify-start">
                  {paymentData.quantity}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {paymentData.price}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {paymentData.price * paymentData.quantity}
                </p>
              </div>
            </div>
          ))}

          <div key="payment-summary">
            <p className="text-sm font-medium text-gray-900 justify-start">
              Sub total: {payments[0].total_price}
            </p>
            <p className="text-sm font-medium text-gray-900 justify-start">
              Shipping Method: {payments[0].shipping_method}
            </p>
            <p className="text-sm font-medium text-gray-900 justify-start">
              Fee: {payments[0].fee}
            </p>
            <p className="text-sm font-medium text-gray-900 justify-start">
              Pay:{' '}
              {(
                parseFloat(payments[0].total_price) +
                parseFloat(payments[0].fee)
              ).toFixed(2)}
            </p>
            <p className="text-sm font-medium text-gray-900 justify-start">
              Shipping_address: {payments[0].shipping_address}
            </p>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
      </div>
      <div className="mt-4 mb-48 sm:mb-64 mr-7 w-full lg:w-2/5 lg:ml-2">
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <AddressForm />

         
          <CheckoutForm />
        
        </Elements>
      )}
      </div>
    </div>
    </>
  );
}

export default Payment;
