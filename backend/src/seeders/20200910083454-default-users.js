'use strict';
require('dotenv').config({ path: __dirname + '/../../.env' });

const crypto = require('crypto');

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
    await queryInterface.bulkInsert('Users', [{
      firstName: 'Administrator',
      lastName: '',
      email: 'admin@kemal24.de',
      userName: 'admin',
      password: crypto.pbkdf2Sync('admin', process.env.CRYPTO_SALT , 1000, 64, `sha512`).toString(`hex`),
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});

    await queryInterface.bulkInsert('Users', [{
      firstName: 'Selcuk',
      lastName: 'Kekec',
      email: 'skekec@kemal24.de',
      userName: 'skekec',
      password: crypto.pbkdf2Sync('skekec', process.env.CRYPTO_SALT , 1000, 64, `sha512`).toString(`hex`),
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});

    await queryInterface.bulkInsert('Users', [{
      firstName: 'Halime',
      lastName: 'Kekec',
      email: 'hekec@kemal24.de',
      userName: 'hkekec',
      password: crypto.pbkdf2Sync('hkekec', process.env.CRYPTO_SALT , 1000, 64, `sha512`).toString(`hex`),
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Users', null, {});
  }
};
