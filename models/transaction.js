"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transaction.hasMany(models.order)
      transaction.hasOne(models.shipping, {
        as: "shipping",
        foreignKey: "transactionId"
      })
      transaction.belongsTo(models.user, {
        as: "buyer",
        foreignKey: "buyerId"
      })
    }
  }
  transaction.init(
    {
      buyerId: DataTypes.INTEGER,
      subTotal: DataTypes.INTEGER,
      totalProduct: DataTypes.INTEGER,
      shippingCost: DataTypes.INTEGER,
      totalPrice: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "transaction",
    }
  );
  return transaction;
};
