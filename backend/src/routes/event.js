import Router from '@koa/router';
import authentication from "../middelwares/authentication";

const router = new Router();

router.use(authentication);

router.get('/', async ctx => {
    const data = await ctx.db().Event.findAll({include: ctx.db().EventType});
    ctx.body = data;
});

router.get('/types', async ctx => {
    const data = await ctx.db().EventType.findAll();
    ctx.body = data;
});

router.post('/', async ctx => {
    const data = Array.isArray(ctx.request.body) ? ctx.request.body : [ctx.request.body];

    const responses = [];
    for (let i in data) {
        let e = data[i];
        // Convert constants to ids
        if (isNaN(e.typeId)) {
            e.typeId = (await ctx.db().knex.select('id').from('EventTypes').where('constant', e.typeId))[0].id;
        }

        if (!e.start) {
            e.start = new Date();
            e.end = new Date();
        }

        responses.push(await ctx.db().Event.create({
            ...e,
            creatorId: ctx.state.user.id
        }));
    }

    ctx.body = responses;
});

export default mainRouter => {
    mainRouter.use('/event', router.routes({throw: true}), router.allowedMethods({throw: true}));
}