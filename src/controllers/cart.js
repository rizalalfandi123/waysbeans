const { cart } = require("../../models");

exports.checkAvailableProduct = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const buyerId = req.user.id;

    const response = await cart.findAll({
      where: {
        buyerId: buyerId,
        productId: productId,
      },
    });

    if (response.length > 0) {
      const qty = response[0].qty;
      const updateData = await cart.update(
        { qty: qty + 1 },
        { where: { buyerId: buyerId, productId: productId } }
      );
      return res.send({
        status: "success",
        message: "Success to update product in cart",
        updateData,
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Failed to check available product in cart",
    });
  }
};

exports.addCart = async (req, res) => {
  try {
    const id = req.user.id;

    const productId = req.body.productId;

    const result = await cart.create({
      productId: productId,
      buyerId: id,
      qty: 1,
    });

    res.send({
      status: "success",
      message: "Success to add a new product to cart",
      cart: {
        productId: result.productId,
        buyerId: result.buyerId,
        qty: result.qty,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Failed to add product",
    });
  }
};

exports.getUserCart = async (req, res) => {
  try {
    const id = req.user.id;

    let result = await cart.findAll({
      where: { buyerId: id },
      attributes: {
        exclude: ["createdAt", "productId", "buyerId"],
      },
      include: {
        association: "product",
        attributes: ["id", "image", "name", "price"],
      },
    });

    let totalProduct = 0;
    let subTotal = 0;
    let shippingCost = 10000;
    let totalPrice = 0;

    result = JSON.parse(JSON.stringify(result));
    result = result.map((item) => {
      totalProduct += item.qty;
      subTotal += item.qty * item.product.price;
      shippingCost += item.qty * 1000;
      return {
        ...item,
        product: {
          ...item.product,
          image: process.env.PATH_FILE + item.product.image,
        },
      };
    });

    totalPrice = subTotal + shippingCost;

    res.send({
      status: "success",
      message: "Success to get all cart",
      userCart: {
        totalProduct,
        subTotal,
        shippingCost,
        totalPrice,
        carts: result,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Failed to get all cart",
    });
  }
};

exports.incrementCart = async (req, res) => {
  try {
    const id = req.params.id;

    let result = await cart.increment(
      { qty: 1 },
      {
        where: { id: id },
      }
    );

    res.send({
      status: "success",
      message: "Success to increment cart",
      increment: result,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Failed to increment cart",
    });
  }
};

exports.decrementCart = async (req, res) => {
  try {
    const id = req.params.id;

    let result = await cart.increment(
      { qty: -1 },
      {
        where: { id: id },
      }
    );

    res.send({
      status: "success",
      message: "Success to decrement cart",
      increment: result,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Failed to decrement cart",
    });
  }
};

exports.getCartCount = async (req, res) => {
  try {
    const id = req.user.id;

    let count = await cart.sum("qty", {
      where: { buyerId: id },
    });

    res.send({
      status: "success",
      message: "Success to get count of cart",
      count,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Failed to get count of cart",
    });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const id = req.params.id;

    const response = await cart.destroy({
      where: {
        id: id,
      },
    });

    res.send({
      status: "success",
      message: "Success to delete cart",
      delete: response,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Failed to delete cart",
    });
  }
};

exports.getDetailCart = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await cart.findOne({
      where: { id: id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      message: "Success to get detail cart",
      cart: result,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Failed to get detail cart",
    });
  }
};
