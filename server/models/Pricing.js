const mongoose = require("mongoose");

const pricingSchema = new mongoose.Schema(
{
    chatPerMinute: {
        type: Number,
        default: 20,
    },

    callPerMinute: {
        type: Number,
        default: 30,
    },

    videoCallPerMinute: {
        type: Number,
        default: 50,
    },

    aiAstro: {
        type: Number,
        default: 10,
    },

    kundli: {
        type: Number,
        default: 25,
    },

    companyCommission: {
        type: Number,
        default: 30,
    },

    astrologerCommission: {
        type: Number,
        default: 70,
    },

},
{
    timestamps: true,
});

module.exports = mongoose.model(
    "Pricing",
    pricingSchema
);