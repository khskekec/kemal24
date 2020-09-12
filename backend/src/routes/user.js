import Router from '@koa/router';
import authentication from "../middelwares/authentication";
import hashing from "../services/hashing";

const router = new Router();

router.use(authentication);

router.post('/', async ctx => {
    const data = Array.isArray(ctx.request.body) ? ctx.request.body : [ctx.request.body];

    ctx.body = await ctx.db().User.create({
        ...ctx.request.body,
        password: hashing(ctx.request.body.password)
    });
});

export default mainRouter => {
    mainRouter.use('/user', router.routes({throw: true}), router.allowedMethods({throw: true}));
}