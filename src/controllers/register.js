const { user } = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    //get data from form
    const formData = req.body;

    //encrypted password with bcrypt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const encryptedPassword = await bcrypt.hash(formData.password, salt);
    formData.password = encryptedPassword;

    //create user
    const result = await user.create(formData);

    //create token with jwt
    const userData = {
      id: result.id,
      name: result.fullname,
      email: result.email,
      role: result.role,
      image: result.image
    };
    const token = jwt.sign(userData, process.env.SECRET_KEY);

    //response
    res.send({
      status: "success",
      message: "Success to create new user",
      user: { email: result.email, token: token, role: result.role },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Failed to create new user",
    });
  }
};
