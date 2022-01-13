const { shipping, transaction } = require("../../models");

exports.addShipping = async (req, res) => {
  try {
    //get data from form
    const formData = req.body;
    const transactionId = req.body.transactionId;

    if (!req.file) {
      return res.send({
        status: "failed",
        message: "Please select image as attachment",
      });
    }

    const result = await shipping.create({
      ...formData,
      attachment: req.file.filename,
    });

    await transaction.update(
      { status: "waiting approve" },
      {
        where: {
          id: transactionId,
        },
      }
    );

    res.send({
      status: "success",
      message: "success to add a new shipping",
      shipping: result,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Failed to new shipping",
    });
  }
};
