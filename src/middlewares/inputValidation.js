const Joi = require("joi");

exports.loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(8).required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.send({
      status: "failed",
      message: error.details[0].message,
    });
  } else {
    console.log(value);
    next();
  }
};

exports.registerValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(8).required(),
    fullname: Joi.string().min(3).required()
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.send({
      status: "failed",
      message: error.details[0].message,
    });
  } else {
    console.log(value);
    next();
  }
};

exports.addProductValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    stock: Joi.number().required(),
    description: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.send({
      status: "failed",
      message: error.details[0].message,
    });
  } else {
    console.log(value);
    next();
  }
};
