import jwt from "../services/jwt";

export default async (ctx, next) => {
    try {
        const token = ctx.cookies.get('token') || ctx.headers['Authorization'].split(' ')[1];
        const payload = jwt.verify(token);

        ctx.state.user = await ctx.db().User.findByPk(payload.id);

        await next();
    } catch (e) {
        ctx.status = 401;
        ctx.body = {
            type: 'CORE_ERROR',
            message: 'Unable to autenthicate.'
        }
    }
}