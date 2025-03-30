const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    sender_upi_id: {
        type: String,
        required: true
    },
    receiver_upi_id: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['deposit', 'withdrawal', 'Deposit', 'Withdrawal'],
        required: true
    },
    description: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transaction', transactionSchema); 