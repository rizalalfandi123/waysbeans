const express = require("express");
const router = express.Router();
const { register } = require("../controllers/register");
const {
  registerValidation,
  loginValidation,
  addProductValidation,
} = require("../middlewares/inputValidation");
const { login } = require("../controllers/login");
const { tokenAuth } = require("../middlewares/tokenAuth");
const { checkAuth, getUserById, editUser } = require("../controllers/user");
const {
  addCart,
  checkAvailableProduct,
  getUserCart,
  getCartCount,
  incrementCart,
  decrementCart,
  getDetailCart,
  deleteCart,
} = require("../controllers/cart");
const {
  getAllProduct,
  addProduct,
  getDetailProduct,
  reduceStock,
  addStock,
  deleteProduct,
  editProduct,
} = require("../controllers/product");

const { uploadFile } = require("../middlewares/uploadFile");
const { addShipping } = require("../controllers/shipping");
const {
  addTransaction,
  getUserTransactions,
  getTransactions,
  editTransactionStatus,
  getTransactionById,
  cancelTransaction,
} = require("../controllers/transaction");

require("dotenv").config();

// ====================================================================> user
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);

router.get("/check-auth", tokenAuth, checkAuth);
router.get("/user", tokenAuth, getUserById);

router.patch("/user", tokenAuth, uploadFile("image"), editUser);

//====================================================================> product
router.get("/products", getAllProduct);
router.get("/product/:id", getDetailProduct);

router.post(
  "/product",
  tokenAuth,
  uploadFile("image"),
  addProductValidation,
  addProduct
);

router.delete("/product/:id", tokenAuth, deleteProduct);

router.patch("/product/:id", tokenAuth, uploadFile("image"), editProduct);

//====================================================================> cart
router.get("/carts", tokenAuth, getUserCart);
router.get("/cart-count", tokenAuth, getCartCount);
router.get("/cart/:id", tokenAuth, getDetailCart);

router.post("/cart", tokenAuth, checkAvailableProduct, addCart);

router.delete("/cart/:id", deleteCart);

router.patch("/increment-cart/:id", incrementCart);
router.patch("/decrement-cart/:id", decrementCart);

// ====================================================================> transaction
router.get("/my-transactions", tokenAuth, getUserTransactions);
router.get("/transactions", tokenAuth, getTransactions);
router.get("/transaction/:id", tokenAuth, getTransactionById);

router.post("/transaction", tokenAuth, reduceStock, addTransaction);

router.patch("/edit-transaction-status/:id", tokenAuth, editTransactionStatus);

router.patch("/cancel-transaction/:id", tokenAuth, addStock, cancelTransaction);

// ====================================================================> shipping
router.post("/shipping", tokenAuth, uploadFile("image"), addShipping);

router.get("/", (req, res) => {
  res.send("Waysbean");
});

module.exports = router;
