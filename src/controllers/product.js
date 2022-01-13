const { product } = require("../../models");

exports.getAllProduct = async (req, res) => {
  try {
    // get product data
    let productData = await product.findAll({
      attributes: {
        exclude: ["updatedAt", "createdAt"],
      },
    });
    //response
    productData = JSON.parse(JSON.stringify(productData));
    productData = productData.map((item) => {
      return { ...item, image: process.env.PATH_FILE + item.image };
    });

    res.send({
      status: "success",
      message: "success to get all product",
      product: productData,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Failed to get product",
    });
  }
};

exports.addProduct = async (req, res) => {
  try {
    //get data from form
    const formData = req.body;

    if (!req.file) {
      return res.send({
        status: "failed",
        message: "Please select file to upload",
      });
    }

    const result = await product.create({
      ...formData,
      userId: req.user.id,
      image: req.file.filename,
    });

    res.send({
      status: "success",
      message: "success to add a new product",
      product: {
        name: result.name,
        price: result.price,
        description: result.description,
        stock: result.stock,
        image: result.image,
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

exports.getDetailProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const productData = await product.findOne({
      where: {
        id: id,
      },
      attributes: {
        exclude: ["updatedAt", "createdAt", "userId"],
      },
    });

    productData.image = process.env.PATH_FILE + productData.image;

    //response
    res.send({
      status: "success",
      message: `success to get detail product`,
      product: productData,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "failed to get detail product",
    });
  }
};

exports.reduceStock = async (req, res, next) => {
  try {
    const data = req.body.orders;

    data.forEach(async (element) => {
      await product.increment(
        {
          stock: -element.qty,
        },
        {
          where: {
            id: element.productId,
          },
        }
      );
    });

    //response
    next();
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "failed to update stock",
    });
  }
};

exports.addStock = async (req, res, next) => {
  try {
    const data = req.body.orders;

    data.forEach(async (element) => {
      await product.increment(
        {
          stock: element.qty,
        },
        {
          where: {
            id: element.productId,
          },
        }
      );
    });

    //response
    next();
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "failed to update stock",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await product.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      delete: response,
    });
  } catch (error) {
    console.log(error);

    res.send({
      status: "failed",
      error,
    });
  }
};

exports.editProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const formData = req.body;

    if (req.file) {
      formData.image = req.file.filename;
    }

    const response = await product.update(
      {
        ...formData,
      },
      {
        where: {
          id,
        },
      }
    );

    res.send({
      status: "success",
      update: response,
    });
  } catch (error) {
    console.log(error);

    res.send({
      status: "failed",
      error,
    });
  }
};
