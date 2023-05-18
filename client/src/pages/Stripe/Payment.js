import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { loadStripe } from '@stripe/stripe-js';

const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

function Payment() {
  const { orderID } = useParams();
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState('');


  useEffect(() => {
    axios
      .get(`${baseUrl}/config`)
      .then(async (result) => {
        console.log(result);
        const { stripe_publishable_key } = await result.data;
        setStripePromise(loadStripe(stripe_publishable_key));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios
      .post(`${baseUrl}/createPaymentIntent/${orderID}`)
      .then(async (result) => {
        console.log(result);
        const { clientSecret } = await result.data;
        setClientSecret(clientSecret);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <h1>React Stripe and the Payment Element</h1>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
}

export default Payment;
