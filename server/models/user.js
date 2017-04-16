const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// {
//   email: 'chris@test.com',
//   password: 'gfdgfgngnfgkjfgjd465757354732',
//   tokens: [{
//     access: 'auth',
//     token: '5634GFDEZ8NFGF098GF6G542664545hrthtr54hrt'
//   }]
// }

var UserSchema = new mongoose.Schema({
  email: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      unique: true,
      validate: {
        isAsync: true,
        validator: validator.isEmail,
        message: `{VALUE} is not a valid email`
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    tokens: [{
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }]
});

// var User = mongoose.model('User', {
//   email: {
//     type: String,
//     required: true,
//     trim: true,
//     minlength: 1,
//     unique: true,
//     validate: {
//       isAsync: true,
//       validator: validator.isEmail,
//       message: `{VALUE} is not a valid email`
//     }
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 6
//   },
//   tokens: [{
//     access: {
//       type: String,
//       required: true
//     },
//     token: {
//       type: String,
//       required: true
//     }
//   }]
// });

UserSchema.methods.toJSON = function () {
  var user = this;
  //https://alexanderzeitler.com/articles/mongoose-tojson-toobject-transform-with-subdocuments/
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};

var User = mongoose.model('User', UserSchema);

module.exports = {User};
