const { user } = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    //get data from input
    const dataForm = req.body;

    //get user data from database
    const userData = await user.findOne({
      where: {
        email: dataForm.email,
      },
    });

    //if data not found
    if (!userData) {
      return res.send({
        status: "failed",
        message: "User not found",
      });
    }

    //check password
    const validPassword = await bcrypt.compare(
      dataForm.password,
      userData.password
    );

    //if invalid Password
    if (!validPassword) {
      return res.send({
        status: "failed",
        message: "Password not valid",
      });
    }

    //create token
    const token = jwt.sign(
      {
        id: userData.id,
        fullname: userData.fullname,
        email: userData.email,
        image: userData.image,
        role: userData.role,
      },
      process.env.SECRET_KEY
    );

    //response
    res.send({
      status: "success",
      message: "Login successfully",
      user: {
        token: token,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Failed login",
    });
  }
};
