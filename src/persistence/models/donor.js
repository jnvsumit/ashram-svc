const mongoose = require('mongoose');

const DonorSchema = new mongoose.Schema({
    donorId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    postalCode: {
        type: String
    },
    country: {
        type: String,
        default: 'India'
    }
}, {timestamps: true});

module.exports = mongoose.model('Donor', DonorSchema);
