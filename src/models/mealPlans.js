const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
  planName: { type: String, required: true},
  timeslot: { type: String, required: true },
  date: { type: String, required: true },
  Menu: { type: String, required: true },
  price: { type: String }
});

const MealPlans = mongoose.model('MealPlans', MealSchema, 'MealPlans');

module.exports = MealPlans;
