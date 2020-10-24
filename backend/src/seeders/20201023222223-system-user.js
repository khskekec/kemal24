'use strict';
require('dotenv').config({ path: __dirname + '/../../.env' });

const crypto = require('crypto');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      firstName: 'System',
      lastName: 'User',
      email: 'system@kemal24.de',
      userName: 'system',
      password: crypto.pbkdf2Sync('@YLNRF=URB7a*k++3ugPR+x?pG-yHQyWhY#%Vznkp+Y7@?t$Ppk=R9=nKE#vqzZPrJAtrt_T33uCw%xvJAK4Vp@q!-ys6M6P3-jc', process.env.CRYPTO_SALT , 1000, 64, `sha512`).toString(`hex`),
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
  }
};
