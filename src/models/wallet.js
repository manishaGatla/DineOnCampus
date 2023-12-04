const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  id: { type: ObjectId, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true }
});

const Wallets = mongoose.model('Wallets', walletSchema, 'Wallets');

module.exports = Wallets;
