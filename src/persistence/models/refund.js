const mongoose = require('mongoose');

const refundSchema = new mongoose.Schema({
    refundId: {
        type: String,
        required: true,
        unique: true
    },
    paymentId: {
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
        enum: ['created', 'processed', 'failed'],
        default: 'created'
    },
    reason: {
        type: String
    },
    notes: {
        type: String
    }
}, {timestamps: true});

module.exports = mongoose.model('Refund', refundSchema);
