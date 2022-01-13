'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      order.belongsTo(models.transaction, {
        as: "transaction",
        foreignKey: "transactionId"
      })

      order.belongsTo(models.product, {
        as: "product",
        foreignKey: "productId"
      })
    }
  };
  order.init({
    productId: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    transactionId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'order',
  });
  return order;
};