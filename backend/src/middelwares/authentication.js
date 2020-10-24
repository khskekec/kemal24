import jwt from "../services/jwt";
import dotEnv from "../services/dotenv";

export default async (ctx, next) => {
    try {
        const appCode = ctx.query.appCode;

        if (process.env.APP_CODE && appCode === process.env.APP_CODE) {
            ctx.state.user = await ctx.db().User.findOne({ where: { username: 'system' } });

            await next();

            return;
        }

        const token = ctx.cookies.get('token') || ctx.headers['Authorization'].split(' ')[1];
        const payload = jwt.verify(token);

        ctx.state.user = await ctx.db().User.findByPk(payload.id);
    } catch (e) {
        console.error(e);
        ctx.status = 401;
        ctx.body = {
            type: 'CORE_ERROR',
            message: 'Unable to authenticate.'
        }

        return;
    }

    await next();
}