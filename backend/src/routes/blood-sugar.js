import Router from '@koa/router';
import authentication from "../middelwares/authentication";
import moment from 'moment';
const router = new Router();

router.use(authentication);

router.get('/current', async ctx => {
    const response = await ctx.db().knex('Events')
        .innerJoin('EventTypes', 'EventTypes.id', 'Events.typeId')
        .where('EventTypes.constant', 'BLOOD_SUGAR')
        .orderBy('Events.start', 'desc')
        .limit(1);

    if (response.length === 0) {
        ctx.body = null;

        return;
    }

    const now = moment(new Date());
    const end = moment(response[0].start);
    const duration = moment.duration(now.diff(end));

    ctx.body = {
        value: response[0].value,
        start: response[0].start,
        minutesAgo: duration.asMinutes()
    };
});

router.get('/', async ctx => {
    const response = await ctx.db().knex('Events')
        .innerJoin('EventTypes', 'EventTypes.id', 'Events.typeId')
        .where('EventTypes.constant', 'BLOOD_SUGAR')
        .orderBy('Events.start', 'asc')
        .select(['Events.id', 'start', 'value', 'description'])
        .limit(9999);

    if (response.length === 0) {
        ctx.body = null;

        return;
    }

    ctx.body = response.reverse();
});

router.get('/daily-avg', async ctx => {
    console.log(ctx.query);
    ctx.body = await avg('DATE_FORMAT(CONVERT_TZ( Events.start, \'UTC\', \'Europe/Berlin\' ), \'%Y-%m-%d\')', ctx.db, ctx.query.start, ctx.query.end);
});

router.get('/hourly-avg', async ctx => {
    ctx.body = await avg('DATE_FORMAT(CONVERT_TZ( Events.start, \'UTC\', \'Europe/Berlin\' ), \'%H\')', ctx.db, ctx.query.start, ctx.query.end);
});

router.get('/daily-hourly-avg', async ctx => {
    ctx.body = await avg('DATE_FORMAT(CONVERT_TZ( Events.start, \'UTC\', \'Europe/Berlin\' ), \'%Y-%m-%d %H:00:00\')', ctx.db, ctx.query.start, ctx.query.end);
});

const avg = async (groupingEval, db, start, end) => {
    const groupingKey = db().knex.raw(groupingEval);

    const response = await db().knex('Events')
        .innerJoin('EventTypes', 'EventTypes.id', 'Events.typeId')
        .where(builder => {
            builder.where('EventTypes.constant', 'BLOOD_SUGAR');

            if (start) {
                    builder.andWhere(db().knex.raw('DATE_FORMAT(CONVERT_TZ( Events.start, \'UTC\', \'Europe/Berlin\' ), \'%Y-%m-%d\')'), '>=', start);
            }

            if (end) {
                builder.andWhere(db().knex.raw('DATE_FORMAT(CONVERT_TZ( Events.start, \'UTC\', \'Europe/Berlin\' ), \'%Y-%m-%d\')'), '<', end);
            }
        })
        .orderBy(groupingKey, 'asc')
        .groupBy(groupingKey)
        .select([
            db().knex.raw('ROUND(AVG(value), 2) as avg'),
            db().knex.raw(groupingEval + ' as point')
        ]);

    return response;
}

export default mainRouter => {
    mainRouter.use('/bloodsugar', router.routes({throw: true}), router.allowedMethods({throw: true}));
}