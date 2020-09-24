import dotEnv from 'dotenv';
import Sequelize from "sequelize";
import sk2 from 'sk2';

dotEnv.config();

const db = {};
const Op = Sequelize.Op;
const sequelize = new Sequelize({
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    pool: {
        max: 10,
        min: 0,
        idle: 30000
    },
    operatorsAliases: {
        $eq: Op.eq,
        $ne: Op.ne,
        $gte: Op.gte,
        $gt: Op.gt,
        $lte: Op.lte,
        $lt: Op.lt,
        $not: Op.not,
        $in: Op.in,
        $notIn: Op.notIn,
        $is: Op.is,
        $like: Op.like,
        $notLike: Op.notLike,
        $iLike: Op.iLike,
        $notILike: Op.notILike,
        $regexp: Op.regexp,
        $notRegexp: Op.notRegexp,
        $iRegexp: Op.iRegexp,
        $notIRegexp: Op.notIRegexp,
        $between: Op.between,
        $notBetween: Op.notBetween,
        $overlap: Op.overlap,
        $contains: Op.contains,
        $contained: Op.contained,
        $adjacent: Op.adjacent,
        $strictLeft: Op.strictLeft,
        $strictRight: Op.strictRight,
        $noExtendRight: Op.noExtendRight,
        $noExtendLeft: Op.noExtendLeft,
        $and: Op.and,
        $or: Op.or,
        $any: Op.any,
        $all: Op.all,
        $values: Op.values,
        $col: Op.col
    }
});

// try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
// } catch (error) {
//     console.error('Unable to connect to the database:', error);
// }

const models = {};
const modelPath = __dirname + '/../models'
const fs = require('fs');
const join = require('path').join;

// Bootstrap models
fs.readdirSync(modelPath)
    .forEach(function(file) {
        if (/\.js$/.test(file)) {

            if (file === 'index.js') {
                return;
            }

            let defineCall = require(join(modelPath, file));
            if (typeof defineCall === 'object') {
                // ES6 module compatibility
                defineCall = defineCall.default;
            }
            const model = defineCall(sequelize, Sequelize.DataTypes);
            models[model.name] = model;
        }
    });

Object.keys(models).forEach(function(modelName) {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

export default {
    sequelize,
    Sequelize: sequelize,
    ...models,
    knex: sk2(sequelize)
};