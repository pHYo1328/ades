import { PaymentElement, AddressElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStripe, useElements } from '@stripe/react-stripe-js';

export default function CheckoutForm({ clientSecret }) {
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
  fetch('http://localhost:8081/addPayment', {
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

        window.location = 'http://localhost:3000/';
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }

    setIsProcessing(false);
  };
  
  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <div style={{ marginBottom: '30px', paddingTop: '20px' }}>
        <h1>Payment form</h1>
      </div>
      <PaymentElement id="payment-element" />
      <AddressElement options={{ mode: 'shipping' }} />
      <button
        disabled={isProcessing || !stripe || !elements}
        id="submit"
        style={{
          outline: '2px solid black',
          marginTop: '20px', // Adjust the color and size of the outline as needed
        }}
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
