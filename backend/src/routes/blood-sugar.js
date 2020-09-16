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


export default mainRouter => {
    mainRouter.use('/bloodsugar', router.routes({throw: true}), router.allowedMethods({throw: true}));
}