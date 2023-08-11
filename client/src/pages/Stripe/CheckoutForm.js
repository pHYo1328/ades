import { PaymentElement, AddressElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStripe, useElements } from '@stripe/react-stripe-js';

const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
const url = process.env.REACT_APP_DOMAIN_BASE_URL;

export default function CheckoutForm({}) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { orderID } = useParams();


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const result = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (result.error) {
        console.error(result.error);
      } else if (result.paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded! PaymentIntent:', result.paymentIntent);

        // Prepare the data to be sent in the request body
        const requestData = {
          paymentIntent: result.paymentIntent,
          orderID: orderID, // Include the orderID in the request body
        };
        console.log(requestData);

        // Make the API call to your backend endpoint
        fetch(`${baseUrl}/addPayment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
          // body: requestData,
        })
          .then((response) => {
            if (response.ok) {
              console.log('Payment details sent to the backend successfully');
            } else {
              console.error('Failed to send payment details to the backend');
            }
          })
          .catch((error) => {
            console.error('Error occurred during API call:', error);
          });

        // Perform any further processing with the billing details if needed

        window.location = `${url}/`;
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }

    setIsProcessing(false);
  };

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      style={{
        paddingBottom: '20px',
        paddingRight: '20px',

        alignItems: 'center',
      }}
    >
      <AddressElement options={{ mode: 'shipping' }} />
      <div style={{ marginBottom: '15px', paddingTop: '5px' }}>
        <h1>Payment form</h1>
      </div>
      <PaymentElement id="payment-element" />

      <button
        disabled={isProcessing || !stripe || !elements}
        id="submit"
        style={{
          outline: '2px solid black',
          marginTop: '20px', // Adjust the color and size of the outline as needed
        }}
        className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <span id="button-text">
          {isProcessing ? 'Processing ... ' : ' Check out '}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
