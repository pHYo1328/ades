import { useEffect, useState } from 'react';
import axios from 'axios';

import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { loadStripe } from '@stripe/stripe-js';

const baseUrl = 'http://localhost:8081';

function Payment() {
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
      .post(`${baseUrl}/createPaymentIntent`, {})
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
