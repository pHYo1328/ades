const cartManagement = require('../services/cart.services')
const chalk = require('chalk')
exports.processAddCartData = async (req, res, next) => {
    console.log(chalk.blue('processAddCartData is running'))
    const {
        userID
    } = req.params
    const {
        cartData
    } = req.body
    if (
        !userID ||
        typeof userID !== 'string' ||
        isNaN(parseInt(userID)) ||
        userID.trim() === ''
    ) {
        return res.status(400).send({
            statusCode: 400,
            ok: false,
            message: 'Invalid userID parameter',
            data: '',
        });
    }

    if (
        !cartData ||
        !Array.isArray(cartData) ||
        cartData.length <= 0 ||
        !cartData.every((item => typeof item === "object"))) {
        return res.status(400).send({
            statusCode: 400,
            ok: false,
            message: "Invalid cartData parameter",
            data: "",
        });
    }
    try {
        const result = await cartManagement.addCartData(userID, cartData)
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
        console.error(chalk.red('Error in processAddCartData:', error))
        return res.status(500).send({
            statusCode: 500,
            ok: false,
            message: 'Internal server error',
            data: ''
        })
    }
}

exports.processGetCartData = async (req, res, next) => {
    console.log(chalk.blue('processAddCartData is running'))
    const {
        userID
    } = req.params
    if (
        !userID ||
        typeof userID !== 'string' ||
        isNaN(parseInt(userID)) ||
        userID.trim() === ''
    ) {
        return res.status(400).send({
            statusCode: 400,
            ok: false,
            message: 'Invalid userID parameter',
            data: '',
        });
    }
    try {
        console.log(
            chalk.yellow("Inspect userID variable\n"), userID
        )
        const result = await cartManagement.getCartData(userID)
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
        return res.status(500).send({
            statusCode: 500,
            ok: false,
            message: 'Internal server error',
            data: ''
        })
    }
}

exports.processDeleteCartData = async (req, res, next) => {
    console.log(chalk.blue('processDeleteCartData is running'))
    const {
        userID
    } = req.params
    if (
        !userID ||
        typeof userID !== 'string' ||
        isNaN(parseInt(userID)) ||
        userID.trim() === ''
    ) {
        return res.status(400).send({
            statusCode: 400,
            ok: false,
            message: 'Invalid userID parameter',
            data: '',
        });
    }
    try {
        console.log(
            chalk.yellow("Inspect userID variable\n"), userID
        );
        const result = await cartManagement.deleteCartData(userID)
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
        return res.status(500).send({
            statusCode: 500,
            ok: false,
            message: 'Internal server error',
            data: ''
        })
    }
}