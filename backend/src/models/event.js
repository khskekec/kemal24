'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsTo(models.User, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        foreignKey: 'creatorId'
      });

      // define association here
      Event.belongsTo(models.EventType, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        foreignKey: 'typeId'
      });
    }
  };
  Event.init({
    title: DataTypes.STRING,
    typeId: DataTypes.INTEGER,
    start: DataTypes.DATE,
    end: DataTypes.DATE,
    value: DataTypes.FLOAT,
    meta: DataTypes.JSON,
    creatorId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};