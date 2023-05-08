const cartServices = require('../services/cart.services')
const chalk = require('chalk')
exports.processAddCartData = async (req, res, next) => {
    console.log(chalk.blue('processAddCartData is running'))
    const {
        userID
    } = req.params
    const {
        cartData
    } = req.body
    try {
        if (
            !userID ||
            isNaN(parseInt(userID)) ||
            userID.trim() === ''
        ) {
            const error = new Error('Invalid userID parameter');
            error.status = 400;
            throw error;
        }
        if (
            !cartData ||
            !Array.isArray(cartData) ||
            cartData.length <= 0 ||
            !cartData.every((item => typeof item === "object"))) {
            const error = new Error('Invalid cartData parameter');
            error.status = 400;
            throw error;
        }
        const result = await cartServices.addCartData(userID, cartData)
        console.log(
            chalk.yellow('Inspect result variable from addCartData service\n'),
            result
        )
        return res.status(201).send({
            statusCode: 201,
            ok: true,
            message: 'cartData added successfully.',
            data: ''
        })
    } catch (error) {
        if (!error.status) {
            // If there's no custom status set, it's an internal server error
            error.status = 500;
            error.message= "Internal server error"
        }
        next(error);
    }
}

exports.processGetCartData = async (req, res, next) => {
    console.log(chalk.blue('processAddCartData is running'))
    const {
        userID
    } = req.params
    try {
        if (
            !userID ||
            isNaN(parseInt(userID)) ||
            userID.trim() === ''
        ) {
            const error = new Error('Invalid userID parameter');
            error.status = 400;
            throw error;
        }
        console.log(
            chalk.yellow("Inspect userID variable\n"), userID
        )
        const result = await cartServices.getCartData(userID)
        console.log(
            chalk.yellow('Inspect result variable from getCartData service\n'),
            result
        )
        return res.status(200).send({
            statusCode: 200,
            ok: true,
            message: 'cartData founded successfully.',
            data: JSON.stringify(result)
        })
    } catch (error) {
        console.error(chalk.red('Error in processAddCartData:', error))
        if (!error.status) {
            error.status = 500;
            error.message= "Internal server error"
        }
        next(error);
    }
}

exports.processDeleteCartData = async (req, res, next) => {
    console.log(chalk.blue('processDeleteCartData is running'))
    const {
        userID
    } = req.params
    
    try {
        if (
            !userID ||
            isNaN(parseInt(userID)) ||
            userID.trim() === ''
        ) {
            const error = new Error('Invalid userID parameter');
            error.status = 400;
            throw error;
        }
        console.log(
            chalk.yellow("Inspect userID variable\n"), userID
        );
        const result = await cartServices.deleteCartData(userID)
        console.log(
            chalk.yellow('Inspect result variable from deleteCartData service\n'),
            result
        )
        return res.status(204).send({
            statusCode: 204,
            ok: true,
            message: 'cartData deleted successfully.',
            data: ''
        })
    } catch (error) {
        console.error(chalk.red('Error in processAddCartData:', error))
        if (!error.status) {
            error.status = 500;
            error.message= "Internal server error"
        }
        next(error);
    }
}