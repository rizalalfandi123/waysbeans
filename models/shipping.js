'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class shipping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  shipping.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    postCode: DataTypes.INTEGER,
    address: DataTypes.STRING,
    attachment: DataTypes.STRING,
    transactionId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'shipping',
  });
  return shipping;
};