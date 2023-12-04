const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  planName: { type: String, required: true},
  timeslot: { type: String, required: true },
  date: { type: String, required: true },
  Menu: { type: String, required: true },
  price: { type: String }
});

const Orders = mongoose.model('Orders', orderSchema, 'Orders');

module.exports = Orders;
