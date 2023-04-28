const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    paymentId: {
        type: String,
        required: true,
        unique: true
    },
    orderId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    status: {
        type: String,
        enum: ['created', 'authorized', 'captured', 'refunded', 'failed'],
        default: 'created'
    },
    method: {
        type: String,
        enum: ['card', 'netbanking', 'wallet', 'emi', 'upi', 'razorpay'],
        required: true
    },
    bank: {
        type: String
    },
    card: {
        type: Object
    },
    wallet: {
        type: String
    },
    vpa: {
        type: String
    },
    emi: {
        type: Object
    },
    upi: {
        type: Object
    }
}, {timestamps: true});

module.exports = mongoose.model('Payment', PaymentSchema);
