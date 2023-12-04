const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  accountNumber: { type: String }, // For Admin
  routingNumber: { type: String }, // For Admin
  billingAddress: { type: String } // For Admin
});

const Admins = mongoose.model('Administrators', AdminSchema, 'Administrators');

module.exports = Admins;
