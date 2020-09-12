'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */

        await queryInterface.bulkInsert('EventTypes', [
            {
                title: 'Blood sugar',
                unit: 'mg/dl',
                constant: 'BLOOD_SUGAR',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Heart Rate',
                unit: 'mg/dl',
                constant: 'HEART_RATE',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Body Weight',
                unit: 'kg',
                constant: 'BODY_WEIGHT',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Body Height',
                unit: 'cm',
                constant: 'BODY_HEIGHT',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Meal',
                unit: 'g',
                constant: 'MEAL',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Bolus',
                unit: 'Units',
                constant: 'BOLUS',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Correction Bolus',
                unit: 'Units',
                constant: 'CORRECTION_BOLUS',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Remark',
                unit: null,
                constant: 'REMARK',
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ], {});
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('EventType', null, {});
    }
};
