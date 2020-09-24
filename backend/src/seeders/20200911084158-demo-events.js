'use strict';
var dotEnv = require('dotenv');
var crypto = require('crypto');
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
        if (process.env.ENV === 'production') {
            return;
        }
        const user = await queryInterface.bulkInsert('Users', [{
            firstName: 'Demo User',
            lastName: '',
            email: 'demo@kemal24.de',
            userName: 'demo',
            password: crypto.pbkdf2Sync('demo', process.env.CRYPTO_SALT , 1000, 64, `sha512`).toString(`hex`),
            createdAt: new Date(),
            updatedAt: new Date(),
        }], {});

        await queryInterface.bulkInsert('Events', [
            {
                title: 'Test-Event',
                typeId: 1,
                start: (new Date()),
                end: (new Date()),
                value: '10',
                creatorId: user,
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
    }
};
