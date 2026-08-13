const Pricing = require("../models/Pricing");

// Get Pricing
exports.getPricing = async (req, res) => {
  try {

    let pricing = await Pricing.findOne();

    // First time database empty hoga
    if (!pricing) {
      pricing = await Pricing.create({});
    }

    res.json({
      success: true,
      pricing,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// Update Pricing
exports.updatePricing = async (req, res) => {

  try {

    let pricing = await Pricing.findOne();

    if (!pricing) {
      pricing = await Pricing.create({});
    }

    Object.assign(pricing, req.body);

    await pricing.save();

    res.json({
      success: true,
      pricing,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};