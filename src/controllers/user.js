const { user } = require("../../models");

exports.checkAuth = async (req, res) => {
  try {
    const id = req.user.id;

    const dataUser = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!dataUser) {
      return res.status(404).send({
        status: "failed",
      });
    }

    res.send({
      status: "success",
    });
  } catch (error) {
    console.log(error);
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const id = req.user.id;
    //get user data
    let userData = await user.findOne({
      where: {
        id: id,
      },
      attributes: {
        exclude: ["updatedAt", "createdAt", "password", "role"],
      },
    });

    userData = JSON.parse(JSON.stringify(userData));
    let imageName = userData.image;
    userData.image = process.env.PATH_FILE + imageName;

    //response
    res.send({
      status: "success",
      user: userData,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "failed get user data",
    });
  }
};

exports.editUser = async (req, res) => {
  try {
    const id = req.user.id;

    if (!req.file) {
      return res.send({
        status: "failed",
        message: "Please select file to upload",
      });
    }

    //get user data
    await user.update(
      { image: req.file.filename },
      {
        where: {
          id: id,
        },
      }
    );

    //response
    res.send({
      status: "success",
      message: "success edit user",
      image: req.file.filename,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "failed edit user",
    });
  }
};
