import Router from '@koa/router';
import authentication from "../middelwares/authentication";
const router = new Router();

router.use(authentication);

router.get('/action', async ctx => {
    const data = await ctx.db().Event.findOne({ include: ctx.db().EventType });
    ctx.body = JSON.stringify(data);
});

export default mainRouter => {
    mainRouter.use('/test', router.routes(), router.allowedMethods());
}