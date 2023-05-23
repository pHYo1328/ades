const cartServices = require('../services/cart.services');
const { processGetCartData } = require('../controller/cart.controller');

// Mock the getCartDataFromRedis function
jest.mock('../services/cart.services.js', () => ({
  getCartDataFromRedis: jest.fn(),
  getCartDataFromMySqlDB: jest.fn(),
  addCartDataToRedis: jest.fn(),
}));

describe('processGetCartData', () => {
  it('should retrieve cart data from Redis if available', async () => {
    // Mock the Redis server being up
    cartServices.getCartDataFromRedis.mockResolvedValue(['item1', 'item2']);

    const req = {
      params: {
        userID: '123',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const next = jest.fn();

    await processGetCartData(req, res, next);

    expect(cartServices.getCartDataFromRedis).toHaveBeenCalledWith('123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: 'cartData found successfully.',
      data: ['item1', 'item2'],
    });
    expect(cartServices.getCartDataFromMySqlDB).not.toHaveBeenCalled();
    expect(cartServices.addCartDataToRedis).not.toHaveBeenCalled();
  });

  it('should retrieve cart data from MySQL and add it to Redis if not available', async () => {
    // Mock the Redis server being down
    cartServices.getCartDataFromRedis.mockResolvedValue(null);
    cartServices.getCartDataFromMySqlDB.mockResolvedValue(['item1', 'item2']);

    const req = {
      params: {
        userID: '123',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const next = jest.fn();

    await processGetCartData(req, res, next);

    expect(cartServices.getCartDataFromRedis).toHaveBeenCalledWith('123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: 'cartData found successfully.',
      data: ['item1', 'item2'],
    });
    expect(cartServices.getCartDataFromMySqlDB).toHaveBeenCalledWith('123');
    expect(cartServices.addCartDataToRedis).toHaveBeenCalledWith('123', ['item1', 'item2']);
  });
});
