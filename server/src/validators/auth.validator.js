const Joi = require("joi");

const register = Joi.object({
  name:     Joi.string().min(2).max(60).required(),
  email:    Joi.string().email().required(),
  password: Joi.string().min(8).max(72).required(),
});

const login = Joi.object({
  email:    Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateProfile = Joi.object({
  name:   Joi.string().min(2).max(60),
  phone:  Joi.string().allow("", null),
  avatar: Joi.string().uri().allow("", null),
});

const changePassword = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword:     Joi.string().min(8).max(72).required(),
});

module.exports = { register, login, updateProfile, changePassword };
