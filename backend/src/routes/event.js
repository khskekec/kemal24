import Router from '@koa/router';
import authentication from "../middelwares/authentication";
import {
    eventCreated,
    eventDeleted
} from "../services/event-types";
import {Op} from "sequelize";
import moment from "moment";

const router = new Router();

router.use(authentication);

router.get('/', async ctx => {
    const allowedFilterParams = Object.keys(ctx.db().Event.rawAttributes);

    const conditions =Object.keys(ctx.query)
        .filter(key => allowedFilterParams.includes(key))
        .reduce((obj, key) => {
            obj[key] = ctx.query[key];
            return obj;
        }, {});

    if (ctx.query.liveMonitor) {
        conditions['start'] = {
            [Op.gte]: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
        }
    }
    const data = await ctx.db().Event.findAll({
        where: conditions,
        include: ctx.db().EventType,
        order: ctx.db().sequelize.literal('start desc'),
        limit: parseInt(ctx.query.limit) || 500,
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

    ctx.ws.broadcast(eventCreated(responses));

    ctx.body = responses;
});

router.delete('/:id', async ctx => {
    ctx.body = await ctx.db().knex('Events').where('id', ctx.params.id).del();

    ctx.eventBus.sendWs(eventDeleted(ctx.params.id));
})

export default mainRouter => {
    mainRouter.use('/event', router.routes({throw: true}), router.allowedMethods({throw: true}));
}