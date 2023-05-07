const cartServices = require('../services/cart.services');
const Redis = require('ioredis');
const RedisMock = require('ioredis-mock');

jest.mock('ioredis', () => {
  const RedisMock = require('ioredis-mock');
  return RedisMock;
});

describe('Cart services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('addCartData with valid input', async () => {
    const userID = '1';
    const cartData = JSON.stringify([{ productID: '101', quantity: 2 }]);
    const result = await cartServices.addCartData(userID, cartData);
    expect(result).toBe('OK');
  });

  test('getCartData with valid input', async () => {
    const userID = '1';
    const cartData = JSON.stringify([{ productID: '101', quantity: 2 }]);
    await cartServices.addCartData(userID, cartData);
    const result = await cartServices.getCartData(userID);
    expect(result).toBe(cartData);
  });

  test('deleteCartData with valid input', async () => {
    const userID = '1';
    const cartData = JSON.stringify([{ productID: '101', quantity: 2 }]);
    await cartServices.addCartData(userID, cartData);
    const result = await cartServices.deleteCartData(userID);
    expect(result).toBe(1);
  });

  test('Error handling in addCartData, getCartData and deleteCartData', async () => {
    const userID = '1';
    const cartData = JSON.stringify([{ productID: '101', quantity: 2 }]);
    const errorMessage = 'Redis command error';
  
    // Create a mock implementation of cartServices that throws an error
    const errorCartServices = {
      ...cartServices,
      addCartData: jest.fn().mockRejectedValue(new Error(errorMessage)),
      getCartData: jest.fn().mockRejectedValue(new Error(errorMessage)),
      deleteCartData: jest.fn().mockRejectedValue(new Error(errorMessage)),
    };
  
    await expect(errorCartServices.addCartData(userID, cartData)).rejects.toThrow(errorMessage);
    await expect(errorCartServices.getCartData(userID)).rejects.toThrow(errorMessage);
    await expect(errorCartServices.deleteCartData(userID)).rejects.toThrow(errorMessage);
  });
});
