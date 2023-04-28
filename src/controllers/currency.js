const { Currency } = require('../persistence/models');

const getAcceptedCurrencies = async (req, res) => {
    try {
        const currencies = await Currency.find();

        return res.status(200).json({
            status: 200,
            messageCode: 'SUCCESS',
            message: 'Accepted currencies retrieved successfully',
            data: currencies.map(currency => {
                return {
                    code: currency.code,
                    name: currency.name,
                    symbol: currency.symbol
                };
            }),
            success: true
        });
    } catch (error) {
        console.error('Error retrieving accepted currencies:', error);

        return res.status(500).json({
            status: 500,
            messageCode: 'SERVER_ERROR',
            message: 'Error retrieving accepted currencies',
            data: null,
            success: false
        });
    }
};

module.exports = {
    getAcceptedCurrencies
};