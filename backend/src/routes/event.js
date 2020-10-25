import Router from '@koa/router';
import authentication from "../middelwares/authentication";
import {
    eventCreated,
    eventDeleted
} from "../services/event-types";

const router = new Router();

router.use(authentication);

router.get('/', async ctx => {
    const data = await ctx.db().Event.findAll({
        include: ctx.db().EventType,
        order: ctx.db().sequelize.literal('start desc'),
        limit: 500,
        attributes: {exclude: ['attachments']}
    });

    ctx.body = data.map(e => {
        return {
            ...e.dataValues,
            meta: JSON.parse(e.dataValues.meta ? e.dataValues.meta : 'null')
        }
    });
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

    ctx.eventBus.sendWs(eventCreated(responses));

    ctx.body = responses;
});

router.delete('/:id', async ctx => {
    ctx.body = await ctx.db().knex('Events').where('id', ctx.params.id).del();

    ctx.eventBus.sendWs(eventDeleted(ctx.params.id));
})

export default mainRouter => {
    mainRouter.use('/event', router.routes({throw: true}), router.allowedMethods({throw: true}));
}