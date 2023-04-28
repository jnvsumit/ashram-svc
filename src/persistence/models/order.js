const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    donorId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    receipt: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['created', 'paid', 'cancelled'],
        default: 'created'
    },
    paymentId: {
        type: String
    },
    paymentStatus: {
        type: String,
        enum: ['success', 'failed'],
    }
}, {timestamps: true});

module.exports = mongoose.model('Order', OrderSchema);
