const request = require('supertest');
const express = require('express');
const app = express();
const cartController = require('../controller/cart.controller');

app.use(express.json());
app.post('/cart/:userID', cartController.processAddCartData);

describe('POST /cart/:userID', () => {
  const validUserID = '1';
  const invalidUserID = 'abc';
  const userIDWithSpaces = ' ';
  const validCartData = [
    { productID: '101', quantity: 2 },
    { productID: '102', quantity: 1 },
  ];
  const invalidCartData = 'not an array';
  const emptyCartData = [];
  const cartDataWithNonObjects = ['101', '102'];

  test('Valid request', async () => {
    const response = await request(app)
      .post(`/cart/${validUserID}`)
      .send({ cartData: validCartData });
    expect(response.statusCode).toBe(201);
    expect(response.body.ok).toBeTruthy();
    expect(response.body.message).toBe('cartData added successfully.');
  });

  test('Invalid userID parameter', async () => {
    const response = await request(app)
      .post(`/cart/${invalidUserID}`)
      .send({ cartData: validCartData });
    expect(response.statusCode).toBe(400);
    expect(response.body.ok).toBeFalsy();
    expect(response.body.message).toBe('Invalid userID parameter');
  });

  test('userID parameter with only spaces', async () => {
    const response = await request(app)
      .post(`/cart/${encodeURIComponent(userIDWithSpaces)}`)
      .send({ cartData: validCartData });
    expect(response.statusCode).toBe(400);
    expect(response.body.ok).toBeFalsy();
    expect(response.body.message).toBe(
      'Invalid userID parameter'
    );
  });
  

  test('Invalid cartData parameter (not an array)', async () => {
    const response = await request(app)
      .post(`/cart/${validUserID}`)
      .send({ cartData: invalidCartData });
    expect(response.statusCode).toBe(400);
    expect(response.body.ok).toBeFalsy();
    expect(response.body.message).toBe('Invalid cartData parameter');
  });

  test('Invalid cartData parameter (empty array)', async () => {
    const response = await request(app)
      .post(`/cart/${validUserID}`)
      .send({ cartData: emptyCartData });
    expect(response.statusCode).toBe(400);
    expect(response.body.ok).toBeFalsy();
    expect(response.body.message).toBe('Invalid cartData parameter');
  });

  test('Invalid cartData parameter (non-object elements)', async () => {
    const response = await request(app)
      .post(`/cart/${validUserID}`)
      .send({ cartData: cartDataWithNonObjects });
    expect(response.statusCode).toBe(400);
    expect(response.body.ok).toBeFalsy();
    expect(response.body.message).toBe('Invalid cartData parameter');
  });
});
