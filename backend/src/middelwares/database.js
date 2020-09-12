import database from '../services/database';

export default async (ctx, next) => {
    ctx.db = () => database;

    await next();
}