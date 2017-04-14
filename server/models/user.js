const mongoose = require('mongoose');

var User = mongoose.model('User', {
  email: {
    type: String,
    require: true,
    minglength: 1,
    trim: true
  }
});

module.exports = {User};
