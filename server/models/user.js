const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

UserSchema.methods.toJSON = function() {
  var user = this;
  //https://alexanderzeitler.com/articles/mongoose-tojson-toobject-transform-with-subdocuments/
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function(token) {
  var user = this;

  return user.update({
    $pull: {
      tokens: {token}
    }
  });
};

UserSchema.statics.findByToken = function(token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject();
  }

  // returns promise. Querying subdoc
  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function(email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    //bcrypt only supports cb, not promises
    // wrapping cb into promise
    return new Promise((resolve, reject) => {
      // https://www.npmjs.com/package/bcrypt
      // challenge
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

// mongoose middleware: http://mongoosejs.com/docs/middleware.html
UserSchema.pre('save', function(next) {
  var user = this;

  // we avoid to run de .pre middle every time by if statement and .isModified method
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
      next();
  }

});

var User = mongoose.model('User', UserSchema);

module.exports = {User};
