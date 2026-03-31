const mongoose = require('mongoose');

const signalSchema = new mongoose.Schema({
    symbol: { type: String, required: true, uppercase: true },
    direction: { type: String, enum: ['BUY', 'SELL'], required: true },
    entry_price: { type: Number, required: true },
    stop_loss: { type: Number, required: true },
    target_price: { type: Number, required: true },
    entry_time: { type: Date, required: true },
    expiry_time: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ['OPEN', 'TARGET_HIT', 'STOPLOSS_HIT', 'EXPIRED'], 
        default: 'OPEN' 
    },
    realized_roi: { type: Number, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Signal', signalSchema);
