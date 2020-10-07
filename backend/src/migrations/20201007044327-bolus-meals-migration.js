'use strict';

const Models = require('../models/index');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = await Models.Event.findAll({
      where: {
        typeId: 5
      }
    });

    for (let i in data){
      const model = data[i];
      const set = model.meta;

      if (set && set['totalKe']) {
        const newSet = {
          ...set,
          meals: {
            meals: set.meals,
            totalCarbs: set.totalCarbs,
            totalKes: set.totalKe,
            totalWeight: set.meals.reduce((total, e) => total + e.weight, 0),
          }
        }

        delete newSet.totalKe;
        delete newSet.totalCarbs;
        model.meta = newSet;

        await model.save();
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
