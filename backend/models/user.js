const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Jacques Cousteau',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Explorador',
  },
  avatar: {
    type: String,
    validate: {
      validator(v) {
        return /https?:\/\/(www\.)?[a-zA-Z0-9\-]+(\.[a-zA-Z]{2,})?([a-zA-Z0-9\-._~:\/?%#\[\]@!$&\'()*+,;=]*)?/.test(
          v,
        );
      },
      message: (props) => `${props.value} is not a valid !`,
    },
    default: 'https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Formato de correo electrónico incorrecto',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        const error = new Error('Email o contraseña incorrectos');
        error.statusCode = 401;
        return Promise.reject(error);
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            const error = new Error('Email o contraseña incorrectos');
            error.statusCode = 401;
            return Promise.reject(error);
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
