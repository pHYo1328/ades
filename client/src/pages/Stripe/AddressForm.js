import React from 'react';
import { AddressElement } from '@stripe/react-stripe-js';

const AddressForm = () => {
  return (
    <form>
      <h3>Billing</h3>
      <AddressElement options={{ mode: 'billing' }} />
    </form>
  );
};

export default AddressForm;
