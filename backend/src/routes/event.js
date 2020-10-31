import Router from '@koa/router';
import authentication from "../middelwares/authentication";
import {
    eventCreated,
    eventDeleted
} from "../services/event-types";
import {Op} from "sequelize";
import moment from "moment";
import {avg} from "./blood-sugar";

const router = new Router();

router.use(authentication);

router.get('/', async ctx => {
    const allowedFilterParams = Object.keys(ctx.db().Event.rawAttributes);

    const conditions = Object.keys(ctx.query)
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

router.get('/statistic', async ctx => {
    // const start = moment().startOf('day');
    const start = moment().startOf('day');

    ctx.body = start;
    const data = {};
    const todaysBloodSugarEvents = await ctx.db().knex('Events')
        .innerJoin('EventTypes', 'EventTypes.id', 'Events.typeId')
        .where(builder => {
            builder.where('EventTypes.constant', 'BLOOD_SUGAR');
            //builder.andWhere('Events.start', '>=', start.format('YYYY-MM-DDTHH:mm:ss'));
            builder.andWhere('Events.start', '>=', start.toISOString());
        }).orderBy('Events.start', 'asc');

    data.bloodSugar = {
        newest: todaysBloodSugarEvents[todaysBloodSugarEvents.length - 1],
        average: todaysBloodSugarEvents.map(e => e.value).reduce((p, v) => p + v, 0) / todaysBloodSugarEvents.length,
        test: moment().startOf('day').format('YYYY-MM-DD')
    }

    data.bloodSugar.hourlyAvg = await avg('DATE_FORMAT(CONVERT_TZ( Events.start, \'UTC\', \'Europe/Berlin\' ), \'%Y-%m-%d %H:00:00\')', ctx.db, moment().startOf('day').format('YYYY-MM-DD'), null);

    const collection = {
        above: 0,
        inRange: 0,
        below: 0
    };

    const timer = (data, index) => {
        const set = data[index];
        console.log(set,index);
        for (let i = index+1 ; i < data.length ; i++) {
            console.log(i);
            if (set.value <= 200 && set.value >= 80) {
                console.log('inRange branch', data[i].value)
                if (data[i].value >= 200 || data[i].value <= 80) {
                    console.log('threshold exeeded', data[i]);
                    // Pack es in range
                    collection.inRange += Math.abs(moment(set.start).diff(moment(data[i].start)));
                    timer(data, i);
                    return;
                }
            }

            if (set.value >= 200) {
                console.log('above branch')
                if (data[i].value < 200) {
                    console.log('threshold exeeded', data[i]);
                    collection.above += Math.abs(moment(set.start).diff(moment(data[i].start)));
                    timer(data, i);
                    return;
                }
            }

            if (set.value <= 80) {
                console.log('below branch')
                if (data[i].value > 80) {
                    console.log('threshold exeeded', data[i]);
                    collection.below += Math.abs(moment(set.start).diff(moment(data[i].start)));
                    timer(data, i);
                    return;
                }
            }
        }

        if (set.value <= 200 && set.value >= 80) {
            console.log('FINISH INRANGE');
            collection.inRange += Math.abs(moment(set.start).diff(moment(data[data.length-1].start)));
        }

        if (set.value >= 200) {
            console.log('FINISH above');
            collection.above += Math.abs(moment(set.start).diff(moment(data[data.length-1].start)));
        }

        if (set.value <= 80) {
            console.log('FINISH below');
            collection.below += Math.abs(moment(set.start).diff(moment(data[data.length-1].start)));
        }
    }

    timer(todaysBloodSugarEvents, 0);

    data.col = collection;
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