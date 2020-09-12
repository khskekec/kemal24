'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Events', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            title: {
                type: Sequelize.STRING,
            },
            typeId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'EventTypes', // name of Target model
                    key: 'id', // key in Target model that we're referencing
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            start: {
                type: Sequelize.DATE
            },
            end: {
                type: Sequelize.DATE
            },
            value: {
                type: Sequelize.FLOAT
            },
            meta: {
                type: Sequelize.JSON
            },
            creatorId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users', // name of Target model
                    key: 'id', // key in Target model that we're referencing
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Events');
    }
};