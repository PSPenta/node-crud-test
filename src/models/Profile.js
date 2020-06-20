const { Schema, model } = require('mongoose');

const profileSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  middleName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: true
  },
  contact: {
    type: Number,
    required: true
  }
});

module.exports = model('Profile', profileSchema);
