const { transaction, order, cart } = require("../../models");
const { Op } = require("sequelize");

exports.addTransaction = async (req, res) => {
  try {
    const data = req.body;
    const buyerId = req.user.id;

    const result = await transaction.create(
      {
        buyerId,
        ...data,
      },
      {
        include: [{ model: order, as: "orders" }],
      }
    );

    await cart.destroy({ where: { buyerId } });

    res.send({
      status: "success",
      message: "success to add a new transaction",
      transaction: result,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Failed to new transaction",
    });
  }
};

exports.getUserTransactions = async (req, res) => {
  try {
    const buyerId = req.user.id;

    const result = await transaction.findAll({
      where: {
        buyerId,
      },
      attributes: { exclude: ["updatedAt"] },
      include: [
        {
          model: order,
          as: "orders",
          attributes: ["qty"],
          include: {
            association: "product",
            attributes: ["image", "name", "price"],
          },
        },
        {
          association: "shipping",
        },
      ],
    });

    res.send({
      status: "success",
      message: "success to get transactions",
      transaction: result,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Failed get transactions",
    });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const result = await transaction.findAll({
      where: { status: { [Op.ne]: "waiting payment" } },
      attributes: { exclude: ["updatedAt"] },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: order,
          as: "orders",
          attributes: ["qty", "productId"],
          include: {
            association: "product",
            attributes: ["image", "name", "price"],
          },
        },
        {
          association: "shipping",
        },
        {
          association: "buyer",
        },
      ],
    });

    res.send({
      status: "success",
      message: "success to get transactions",
      transactions: result,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Failed get transactions",
    });
  }
};

exports.getTransactionById = async (req, res) => {
  const transactionId = req.params.id;

  try {
    const result = await transaction.findOne({
      where: {
        id: transactionId,
      },
      include: {
        model: order,
        as: "orders",
        attributes: ["qty"],
        include: {
          association: "product",
          attributes: ["image", "name", "price"],
        },
      },
    });

    res.send({
      status: "success",
      message: "success to get transaction",
      transaction: result,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Failed get transaction",
    });
  }
};

exports.editTransactionStatus = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const status = req.body.status;

    const result = await transaction.update(
      { status: status },
      {
        where: { id: transactionId },
      }
    );

    res.send({
      status: "success",
      message: "success update transaction",
      transactions: result,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Failed update transaction",
    });
  }
};

exports.cancelTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;

    const result = await transaction.update(
      { status: "cancel" },
      {
        where: { id: transactionId },
      }
    );

    res.send({
      status: "success",
      message: "success update transaction",
      transactions: result,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Failed update transaction",
    });
  }
};
