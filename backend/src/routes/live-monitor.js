import Router from '@koa/router';
import authentication from "../middelwares/authentication";
import moment from "moment";
const router = new Router();

router.use(authentication);

router.get('/', async ctx => {
    const date = moment().format('YYYY-MM-DD')

    // Latest, highest, lowest and average bloodsugar value
    const latest = await ctx.db().knex('Events').where('start', '>=', date)
        .andWhere('typeId', '1')
        .orderBy('start', 'desc')
        .limit(1).first();
    const highest = await ctx.db().knex('Events').where('start', '>=', date)
        .andWhere('typeId', '1')
        .orderBy('value', 'desc')
        .limit(1).first()

    const lowest = await ctx.db().knex('Events').where('start', '>=', date)
        .andWhere('typeId', '1')
        .orderBy('value', 'asc')
        .limit(1).first()

    const average = await ctx.db().knex('Events').avg('value')
        .where('start', '>=', date)
        .andWhere('typeId', '1').as('average').first();

    // @todo Time in Range


    const lowestBolus = await ctx.db().knex('Events')
        .select('start','end', 'value', 'meta')
        .where('start', '>=', date)
        .andWhere('typeId', '5')
        .orderBy('value', 'asc')
        .limit(1).first();

    const highestBolus = await ctx.db().knex('Events')
        .select('start','end', 'value', 'meta')
        .where('start', '>=', date)
        .andWhere('typeId', '5')
        .orderBy('value', 'desc')
        .limit(1).first();

    const amountBolus = await ctx.db().knex('Events')
        .count('*')
        .where('start', '>=', date)
        .andWhere('typeId', '5').first();

    const latestBolus = await ctx.db().knex('Events')
        .select('start','end', 'value', 'meta')
        .where('start', '>=', date)
        .andWhere('typeId', '5')
        .orderBy('start', 'desc')
        .limit(1).first();

    const totalBolusInsulin = await ctx.db().knex('Events')
        .where('start', '>=', date)
        .andWhere('typeId', '5')
        .sum('value').first();

    const totalCarbs = (await ctx.db().knex
        .raw('SELECT SUM(CAST(JSON_EXTRACT(meta, \'$.totalKe\') AS DECIMAL(10,3))) as totalCarbs FROM `Events` WHERE typeId = 5 and meta is not NULL'))[0].totalCarbs

    ctx.body = {
        date: date,
        bloodSugar: {
            latest,
            highest,
            average: average['avg(`value`)'],
            lowest,
        },
        bolus: {
            totalInsulin: totalBolusInsulin['sum(`value`)'],
            lowest: lowestBolus,
            highest: highestBolus,
            amount: amountBolus['count(*)'],
            latest: latestBolus,
            totalCarbs
        }
    };
});

export default mainRouter => {
    mainRouter.use('/live-monitor', router.routes({throw: true}), router.allowedMethods({throw: true}));
}