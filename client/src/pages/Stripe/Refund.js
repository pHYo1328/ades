import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import chalk from 'chalk';

function RefundPayment() {
  const { orderID } = useParams();
  const [payments, setPayments] = useState(null);
  const [refunds, setRefunds] = useState(null);

  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/payment/${orderID}`)
      .then((response) => {
        console.log(response);
        setPayments(response.data.data);
        console.log(payments);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleBack = async (event) => {
    console.log(chalk.yellow('Back button is clicked!'));
    event.preventDefault();
    window.location.href = `/admin`;
  };

  const handleRefund = async (event) => {
    console.log(chalk.yellow('Refund button is clicked!'));
    event.preventDefault();
    axios
      .post(`${baseUrl}/processRefund/${orderID}`)
      .then((response) => {
        console.log(response);
        setRefunds(response.data.data);
        console.log(refunds);
      })
      .catch((error) => {
        console.error(error);
      });

    window.alert('Giving refund now...');
  };

  return (
    <>
      <h1>The details of order</h1>

      {payments && payments.length > 0 ? (
        <>
          {payments.map((paymentData) => (
            <div key={paymentData.order_id} className="group relative">
              <div>{paymentData.product_name}</div>
              <div>
                <p className="mt-1 text-sm text-gray-500">
                  {paymentData.price}
                </p>
                <p className="text-sm font-medium text-gray-900 justify-start">
                  {paymentData.description}
                </p>
                <p className="text-sm font-medium text-gray-900 justify-start">
                  {paymentData.quantity}
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
              Charged amount:{' '}
              {(
                parseFloat(payments[0].total_price) +
                parseFloat(payments[0].fee)
              ).toFixed(2)}
            </p>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}

      <div
        class="row col-10"
        style={{ marginRight: 'auto', marginLeft: 'auto' }}
      >
        <div class="row">
          <div class="col-4">
            <button
              class="btn btn-outline-success w-100"
              onClick={handleRefund}
            >
              Refund
            </button>
          </div>

          <div class="col-4">
            <button class="btn btn-outline-success w-100" onClick={handleBack}>
              Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default RefundPayment;
