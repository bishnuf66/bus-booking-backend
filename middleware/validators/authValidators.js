const Joi = require('joi');


//register validation schema
const registerSchema = Joi.object({
  userName: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required(),

});

module.exports.validateRegister = (data) => registerSchema.validateAsync(data);

//login validation schema
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });
  
  module.exports.validateLogin = (data) => loginSchema.validateAsync(data);