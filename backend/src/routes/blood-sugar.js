import Router from "@koa/router";
import authentication from "../middelwares/authentication";
import moment from "moment";
const router = new Router();

const bloodSugarRangeConfiguration = [
  {
    upperThreshold: 140,
    lowerThreshold: 1,
    color: "51:153:0",
  },
  {
    upperThreshold: 160,
    lowerThreshold: 140,
    color: "153:204:51",
  },
  {
    upperThreshold: 180,
    lowerThreshold: 160,
    color: "255:204:0",
  },
  {
    upperThreshold: 200,
    lowerThreshold: 180,
    color: "255:153:102",
  },
  {
    upperThreshold: null,
    lowerThreshold: 200,
    color: "204:51:0",
  },
];

function getBloodSugarRange(value) {
  return bloodSugarRangeConfiguration.filter(
    (e) =>
      (e.upperThreshold ? value <= e.upperThreshold : true) &&
      (e.lowerThreshold ? value > e.lowerThreshold : true)
  )[0];
}
router.use(authentication);

router.get("/currentPanel", async (ctx) => {
  const response = await ctx
    .db()
    .knex("Events")
    .innerJoin("EventTypes", "EventTypes.id", "Events.typeId")
    .where("EventTypes.constant", "BLOOD_SUGAR")
    .orderBy("Events.start", "desc")
    .limit(2);

  if (response.length === 0) {
    ctx.body = null;

    return;
  }

  const now = moment(new Date());
  const end = moment(response[0].start);
  const duration = moment.duration(now.diff(end));
  const trend = JSON.parse(response[0].meta).trend;
  const trendConfiguration = {
    STEADY: {
      text: ">",
      color: "51:153:0",
    },
    RISING_SLIGHTLY: {
      text: "^>",
      color: "153:204:51",
    },
    FALLING_SLIGHTLY: {
      text: "u>",
      color: "153:204:51",
    },
    FALLING: {
      text: "u",
      color: "255:153:02",
    },
    RISING: {
      text: "^",
      color: "255:153:102",
    },
    FALLING_QUICKLY: {
      text: "uu",
      color: "204:51:0",
    },
    RISING_QUICKLY: {
      text: "^^",
      color: "204:51:0",
    },
    NOT_IDENTIFIABLE: {
      text: "?",
      color: "204:51:0",
    },
    "": {
      text: "?",
      color: "204:51:0",
    },
    NOT_AVAILABLE: {
      text: "-",
      color: "204:51:0",
    },
  };

  const level = (response[1].value - response[0].value) * -1;

  const panelResponse = `${response[0].value}${
    trendConfiguration[trend]["text"]
  }:${level}:${duration.asMinutes().toFixed(2)}m:${
    getBloodSugarRange(response[0].value)["color"]
  }:${trendConfiguration[trend]["color"]}`;

  ctx.body = panelResponse;
});

router.get("/current", async (ctx) => {
  const response = await ctx
    .db()
    .knex("Events")
    .innerJoin("EventTypes", "EventTypes.id", "Events.typeId")
    .where("EventTypes.constant", "BLOOD_SUGAR")
    .orderBy("Events.start", "desc")
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
    minutesAgo: duration.asMinutes(),
  };
});

router.get("/", async (ctx) => {
  const response = await ctx
    .db()
    .knex("Events")
    .innerJoin("EventTypes", "EventTypes.id", "Events.typeId")
    .where("EventTypes.constant", "BLOOD_SUGAR")
    .orderBy("Events.start", "asc")
    .select(["Events.id", "start", "value", "description"])
    .limit(9999);

  if (response.length === 0) {
    ctx.body = null;

    return;
  }

  ctx.body = response.reverse();
});

router.get("/daily-avg", async (ctx) => {
  console.log(ctx.query);
  ctx.body = await avg(
    "DATE_FORMAT(CONVERT_TZ( Events.start, 'UTC', 'Europe/Berlin' ), '%Y-%m-%d')",
    ctx.db,
    ctx.query.start,
    ctx.query.end
  );
});

router.get("/hourly-avg", async (ctx) => {
  ctx.body = await avg(
    "DATE_FORMAT(CONVERT_TZ( Events.start, 'UTC', 'Europe/Berlin' ), '%H')",
    ctx.db,
    ctx.query.start,
    ctx.query.end
  );
});

router.get("/daily-hourly-avg", async (ctx) => {
  ctx.body = await avg(
    "DATE_FORMAT(CONVERT_TZ( Events.start, 'UTC', 'Europe/Berlin' ), '%Y-%m-%d %H:00:00')",
    ctx.db,
    ctx.query.start,
    ctx.query.end
  );
});

export const avg = async (groupingEval, db, start, end) => {
  const groupingKey = db().knex.raw(groupingEval);

  const response = await db()
    .knex("Events")
    .innerJoin("EventTypes", "EventTypes.id", "Events.typeId")
    .where((builder) => {
      builder.where("EventTypes.constant", "BLOOD_SUGAR");

      if (start) {
        builder.andWhere(
          db().knex.raw(
            "DATE_FORMAT(CONVERT_TZ( Events.start, 'UTC', 'Europe/Berlin' ), '%Y-%m-%d')"
          ),
          ">=",
          start
        );
      }

      if (end) {
        builder.andWhere(
          db().knex.raw(
            "DATE_FORMAT(CONVERT_TZ( Events.start, 'UTC', 'Europe/Berlin' ), '%Y-%m-%d')"
          ),
          "<",
          end
        );
      }
    })
    .orderBy(groupingKey, "asc")
    .groupBy(groupingKey)
    .select([
      db().knex.raw("ROUND(AVG(value), 2) as avg"),
      db().knex.raw(groupingEval + " as point"),
    ]);

  const correctionBolus = await db()
    .knex("Events")
    .innerJoin("EventTypes", "EventTypes.id", "Events.typeId")
    .where((builder) => {
      builder.where("EventTypes.constant", "CORRECTION_BOLUS");

      if (start) {
        builder.andWhere(
          db().knex.raw(
            "DATE_FORMAT(CONVERT_TZ( Events.start, 'UTC', 'Europe/Berlin' ), '%Y-%m-%d')"
          ),
          ">=",
          start
        );
      }

      if (end) {
        builder.andWhere(
          db().knex.raw(
            "DATE_FORMAT(CONVERT_TZ( Events.start, 'UTC', 'Europe/Berlin' ), '%Y-%m-%d')"
          ),
          "<",
          end
        );
      }
    })
    .orderBy(groupingKey, "asc")
    .groupBy(groupingKey)
    .select([
      db().knex.raw("ROUND(SUM(value), 2) as avg"),
      db().knex.raw(groupingEval + " as point"),
    ]);

  const bolus = await db()
    .knex("Events")
    .innerJoin("EventTypes", "EventTypes.id", "Events.typeId")
    .where((builder) => {
      builder.where("EventTypes.constant", "BOLUS");

      if (start) {
        builder.andWhere(
          db().knex.raw(
            "DATE_FORMAT(CONVERT_TZ( Events.start, 'UTC', 'Europe/Berlin' ), '%Y-%m-%d')"
          ),
          ">=",
          start
        );
      }

      if (end) {
        builder.andWhere(
          db().knex.raw(
            "DATE_FORMAT(CONVERT_TZ( Events.start, 'UTC', 'Europe/Berlin' ), '%Y-%m-%d')"
          ),
          "<",
          end
        );
      }
    })
    .orderBy(groupingKey, "asc")
    .groupBy(groupingKey)
    .select([
      db().knex.raw("ROUND(SUM(value), 2) as avg"),
      db().knex.raw(groupingEval + " as point"),
    ]);

  const res = response.map((bloodSugar) => {
    let res = null;
    bloodSugar["correction"] = bloodSugar["bolus"] = 0;

    res = correctionBolus.filter((e) => e.point === bloodSugar.point);
    if (res.length) {
      bloodSugar["correction"] = res[0].avg;
    }

    res = bolus.filter((e) => e.point === bloodSugar.point);
    if (res.length) {
      bloodSugar["bolus"] = res[0].avg;
    }

    return bloodSugar;
  });

  return res;
};

export default (mainRouter) => {
  mainRouter.use(
    "/bloodsugar",
    router.routes({ throw: true }),
    router.allowedMethods({ throw: true })
  );
};

