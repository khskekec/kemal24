
export default handler => async (ctx, next) => {
    const errorHandler = handler instanceof Function ? handler : (err, ctx) => ctx.body = 500;
    try {
        await next().catch(err => {
            console.log(err);
            errorHandler(err, ctx);
        });
    } catch (e) {
        ctx.body = 'FAIL';
    }
}