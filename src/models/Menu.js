const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  id: { type: ObjectId, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true }
});

const Menu = mongoose.model('Menu', menuSchema, 'Menu');

module.exports = Menu;
