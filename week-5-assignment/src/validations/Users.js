const Joi = require("joi");

const createUser = Joi.object({
  
  first_name: Joi.string().required().min(2),
  last_name: Joi.string().required().min(2),
  email: Joi.string().email().required().min(8),
  password: Joi.string().required().min(8),
 
});

const createAdminUser = Joi.object({
  
  first_name: Joi.string().required().min(2),
  last_name: Joi.string().required().min(2),
  email: Joi.string().email().required().min(8),
  password: Joi.string().required().min(8),
  isAdmin: Joi.boolean().default(true),
 
});
  
const updateUser = Joi.object({
  
  first_name: Joi.string().min(2),
  last_name: Joi.string().min(2),
  email: Joi.string().email().min(8),
  password: Joi.string().min(8),
  address: Joi.array(),
  phones: Joi.array(),
  favorites: Joi.array(),
 
});

const userQuery = Joi.object({
  id: Joi.string().required().min(2),
  location: Joi.string().required().min(2),
});

const userLogin = Joi.object({
  email: Joi.string().email().required().min(6),
  password: Joi.string().required().min(2),
});

const resetPassword = Joi.object({
  email: Joi.string().email().required().min(6),
});

module.exports = {
  createUser,
  userQuery,
  updateUser,
  userLogin,
  createAdminUser,
  resetPassword
};
