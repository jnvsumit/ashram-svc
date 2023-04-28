const Razorpay = require('razorpay');
const crypto = require('crypto');
const { Order, Payment} = require('../persistence/models');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');

const updatePayment = async (payment, status) => {
    payment.status = status;
    await payment.save();
}

const updateOrder = async (order, status) => {
    order.status = status;
    await order.save();
}

const razorpayWebhook = async (req, res) => {
    try {
        const {body} = req;

        const generatedSignature = crypto.createHmac('sha256', config.razorpay.keySecret);
        generatedSignature.update(JSON.stringify(body));

        const isSignatureValid = generatedSignature.digest('hex') === req.headers['x-razorpay-signature'];

        if (isSignatureValid) {
            const {contains, payload} = body;

            if (contains.includes('payment')) {
                const payment = await Payment.findOne({paymentId: payload.payment.entity.id});

                console.log('payment', payment);

                if (payment) {
                    payment.method = payload.payment.entity.method;

                    if (payload.payment.entity.method === 'card') {
                        payment.card = {
                            brand: payload.payment.entity.card.network,
                            last4: payload.payment.entity.card.last4,
                            expMonth: payload.payment.entity.card.exp_month,
                            expYear: payload.payment.entity.card.exp_year,
                            issuer: payload.payment.entity.card.issuer,
                            country: payload.payment.entity.card.country,
                            type: payload.payment.entity.card.type
                        }

                        payment.bank = payload.payment.entity.card.bank;
                    } else if (payload.payment.entity.method === 'netbanking') {
                        payment.bank = payload.payment.entity.bank;
                    } else if (payload.payment.entity.method === 'wallet') {
                        payment.wallet = payload.payment.entity.wallet;
                    } else if (payload.payment.entity.method === 'upi') {
                        payment.upi = payload.payment.entity.vpa;
                        payment.vpa = payload.payment.entity.vpa;
                    } else if (payload.payment.entity.method === 'emi') {
                        payment.emi = {
                            bank: payload.payment.entity.emi.bank,
                            tenor: payload.payment.entity.emi.tenor,
                            amount: payload.payment.entity.emi.amount,
                            currency: payload.payment.entity.emi.currency,
                            description: payload.payment.entity.emi.description
                        };

                        payment.bank = payload.payment.entity.emi.bank;
                    } else {
                        payment.bank = payload.payment.entity.bank;
                    }

                    await updatePayment(payment, payload.payment.entity.status);
                }
            }

            if (contains.includes('order')) {
                const order = await Order.findOne({orderId: payload.order.entity.id});

                if (order) {
                    await updateOrder(order, payload.order.entity.status);
                }
            }

            return res.status(200).json({
                message: 'Webhook received successfully',
                messageCode: 'WEBHOOK_RECEIVED',
                status: 200,
                success: true,
                data: null
            });
        }
    } catch (error) {
        console.log('error', error);
        return res.status(500).json({
            message: 'Internal server error',
            messageCode: 'INTERNAL_SERVER_ERROR',
            status: 500,
            success: false,
            data: null
        });
    }
}

const createOrder = async (req, res) => {
    try {
        const { currency, amount, donorId } = req.body;

        console.log('currency', currency);
        console.log('amount', amount);
        console.log('donorId', donorId);

        const razorpay = new Razorpay({
            key_id: config.razorpay.keyId,
            key_secret: config.razorpay.keySecret,
        });

        const options = {
            amount: amount * 100,
            currency,
            receipt: ('receipt_' + uuidv4()).substring(0, 32),
        };

        const order = await razorpay.orders.create(options);

        const newOrder = new Order({
            razorpayKey: config.razorpay.keyId,
            orderId: order.id,
            donorId: donorId,
            currency: order.currency,
            amount: order.amount,
            receipt: order.receipt,
            status: 'created'
        });

        await newOrder.save();

        return res.status(201).json({
            message: 'Order created successfully',
            messageCode: 'ORDER_CREATED',
            status: 201,
            success: true,
            data: {
                orderId: order.id,
                currency: order.currency,
                amount: order.amount,
                companyName: 'Ashram',
                companyLogo: 'https://ashram.org.in/assets/images/logo.png',
                companyDescription: 'Ashram is a non-profit organization that works for the welfare of the society.',
                donorId: donorId,
                receipt: order.receipt,
                status: 'created'
            },
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Something went wrong',
            messageCode: 'INTERNAL_SERVER_ERROR',
            status: 500,
            success: false,
            error: err.message,
        });
    }
}

const verifyPayment = async (req, res) => {
    try {
        const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

        console.log('razorpay_payment_id', razorpayPaymentId);
        console.log('razorpay_order_id', razorpayOrderId);
        console.log('razorpay_signature', razorpaySignature);

        const generated_signature = crypto
            .createHmac('sha256', config.razorpay.keySecret)
            .update(razorpayOrderId + '|' + razorpayPaymentId)
            .digest('hex');

        if (generated_signature === razorpaySignature) {
            const order = await Order.findOne({ orderId: razorpayOrderId });

            if (!order) {
                console.log('Order not found');
                return res.status(400).json({
                    message: 'Order not found',
                    messageCode: 'ORDER_NOT_FOUND',
                    status: 400,
                    success: false,
                });
            }

            order.paymentStatus = 'success';
            order.paymentId = razorpayPaymentId;
            await order.save();

            const newPayment = new Payment({
                paymentId: razorpayPaymentId,
                orderId: razorpayOrderId,
                currency: order.currency,
                amount: order.amount,
                method: 'razorpay'
            });

            await newPayment.save();

            return res.status(200).json({
                message: 'Payment successful',
                messageCode: 'PAYMENT_SUCCESSFUL',
                status: 200,
                success: true,
            });
        } else {
            return res.status(400).json({
                message: 'Invalid signature',
                messageCode: 'INVALID_SIGNATURE',
                status: 400,
                success: false,
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Something went wrong',
            messageCode: 'INTERNAL_SERVER_ERROR',
            status: 500,
            success: false,
            error: err.message,
        });
    }
}

module.exports = {
    createOrder,
    verifyPayment,
    razorpayWebhook
};