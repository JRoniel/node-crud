const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const personSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
});

const Person = model('Person', personSchema);

module.exports = Person;
