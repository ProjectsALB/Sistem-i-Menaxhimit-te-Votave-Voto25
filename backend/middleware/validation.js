const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Të dhëna të pavlefshme',
      errors: errors.array()
    });
  }
  next();
};

const voterValidation = [
  body('firstName').notEmpty().withMessage('Emri është i detyrueshëm'),
  body('lastName').notEmpty().withMessage('Mbiemri është i detyrueshëm'),
  body('age').isInt({ min: 18 }).withMessage('Mosha duhet të jetë së paku 18 vjeç'),
  body('email').isEmail().withMessage('Email i pavlefshëm'),
  body('voterId').notEmpty().withMessage('ID e votuesit është e detyrueshme'),
  body('city').isIn(['Tirana', 'Durrës', 'Vlorë', 'Shkodër', 'Elbasan', 'Korçë', 'Fier', 'Berat', 'Lushnjë', 'Kavajë']).withMessage('Qyteti i pavlefshëm'),
  body('address').notEmpty().withMessage('Adresa është e detyrueshme')
];

const candidateValidation = [
  body('name').notEmpty().withMessage('Emri i kandidatit është i detyrueshëm'),
  body('party').isMongoId().withMessage('Partia është e detyrueshme'),
  body('city').isIn(['Tirana', 'Durrës', 'Vlorë', 'Shkodër', 'Elbasan', 'Korçë', 'Fier', 'Berat', 'Lushnjë', 'Kavajë']).withMessage('Qyteti i pavlefshëm'),
  body('age').isInt({ min: 25 }).withMessage('Mosha duhet të jetë së paku 25 vjeç'),
  body('qualifications').notEmpty().withMessage('Kualifikimet janë të detyrueshme'),
  body('manifesto').notEmpty().withMessage('Programi zgjedhor është i detyrueshëm')
];

const partyValidation = [
  body('name').notEmpty().withMessage('Emri i partisë është i detyrueshëm'),
  body('symbol').notEmpty().withMessage('Simboli i partisë është i detyrueshëm'),
  body('leader').notEmpty().withMessage('Kryetari i partisë është i detyrueshëm'),
  body('foundingYear').isInt({ min: 1900, max: 2024 }).withMessage('Viti i themelimit duhet të jetë midis 1900 dhe 2024'),
  body('ideology').notEmpty().withMessage('Ideologjia e partisë është e detyrueshme')
];

module.exports = {
  handleValidationErrors,
  voterValidation,
  candidateValidation,
  partyValidation
};