const Party = require('../models/Party');

// Regjistrimi i partisë
const registerParty = async (req, res) => {
  try {
    const {
      name,
      symbol,
      leader,
      foundingYear,
      ideology
    } = req.body;

    // Kontrollo nëse partia ekziston
    const existingParty = await Party.findOne({
      $or: [{ name }, { symbol }]
    });

    if (existingParty) {
      return res.status(400).json({
        status: 'error',
        message: 'Partia me këtë emër ose simbol tashmë ekziston'
      });
    }

    const party = await Party.create({
      name,
      symbol,
      leader,
      foundingYear,
      ideology
    });

    res.status(201).json({
      status: 'success',
      message: 'Partia u regjistrua me sukses',
      data: party
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Gabim në server'
    });
  }
};

// Merr të gjitha partitë
const getAllParties = async (req, res) => {
  try {
    const parties = await Party.find().sort({ name: 1 });
    res.json({
      status: 'success',
      data: parties
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Gabim në server'
    });
  }
};

module.exports = {
  registerParty,
  getAllParties
};