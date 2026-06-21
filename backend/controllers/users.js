const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const { HttpStatus } = require('../enums/http');
require('dotenv').config();
//-----
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!password) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send({ message: 'La contraseña no está definida' });
  }
  return userModel
    .findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {
          expiresIn: '7d',
        }),
      });
    })
    .catch((err) => {
      next(err);
    });
};
module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(HttpStatus.CONFLICT)
        .send({ message: 'El usuario ya existe' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });

    res.status(HttpStatus.OK).send({
      _id: user._id,
      email: user.email,
    });
  } catch (err) {
    next(err);
  }
};
module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
module.exports.getUsers = async (req, res, next) => {
  try {
    const usersData = await userModel.find({}).orFail();
    res.send({ data: usersData });
  } catch (error) {
    if (error.name === 'DocumentNotFoundError') {
      return res
        .status(HttpStatus.NOT_FOUND)
        .send({ error: 'No se encontraron usuarios.' });
    }
    next(error);
  }
};
module.exports.getUser = async (req, res, next) => {
  try {
    const userData = await userModel.findById(req.params.userId).orFail();
    res.send({ userData });
  } catch (error) {
    if (error.name === 'DocumentNotFoundError') {
      return res
        .status(HttpStatus.NOT_FOUND)
        .send({ error: 'No se encontro el usuario' });
    } if (error.name === 'CastError') {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: 'ID de usuario inválido.' });
    }
    next(error);
  }
};

function isValidURL(url) {
  return /https?:\/\/(www\.)?[a-zA-Z0-9\-]+(\.[a-zA-Z]{2,})?([a-zA-Z0-9\-._~:\/?%#\[\]@!$&'()*+,;=]*)?/.test(
    url,
  );
}
module.exports.updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    if (!isValidURL(avatar)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: 'La URL no es válida para una actualizacion' });
    }
    const updateAvatar = await userModel.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true },
    );
    res.send({ data: updateAvatar });
  } catch (error) {
    next(error);
  }
};
module.exports.updateProfile = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const dataProfile = await userModel.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    res.send({ data: dataProfile });
  } catch (error) {
    if (error.name === 'DocumentNotFoundError') {
      return res
        .status(HttpStatus.NOT_FOUND)
        .send({ error: 'usuario no encontrado.' });
    }
    next(error);
  }
};
