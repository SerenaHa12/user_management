"use strict";
const { Model } = require("sequelize");
const shortId = require("shortid");
module.exports = (sequelize, DataTypes) => {
  class Link extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Link.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      full: DataTypes.STRING,
      short: DataTypes.STRING,
      click: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Link",
      tableName: "links",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Link;
};
