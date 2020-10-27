import './services/dotenv';
import Koa from 'koa';
import requestLogger from './middelwares/request-logger';
import responseTime from './middelwares/response-time';
import bodyParser from './middelwares/body-parser';
import mainRouter from "./services/router";
import database from "./middelwares/database";
import errorHandler from "./middelwares/error-handler";
import cors from '@koa/cors';
import eventBus from './services/event-bus';

const app = new Koa();

app.use(async (ctx, next) => {
    ctx.eventBus = eventBus;

    await next();
});

app.use(cors({
    exposeHeaders: true,
    credentials: true
}));

app.use(errorHandler((err, ctx) => {
    ctx.status = err.status || 500;

    ctx.body = {
        type: 'CORE_ERROR',
        message: err.message,
        stack: err.stack
    }
}));

// Log requests into console
app.use(requestLogger());

// Set response time
app.use(responseTime({hrtime: true}))

// Set body parser
app.use(bodyParser());

// Set database
app.use(database);

// Set main router
mainRouter.use(errorHandler((err, ctx) => {
    ctx.status = 500;

    ctx.body = {
        type: 'ROUTE_ERROR',
        message: err.message,
        stack: err.stack
    }
}));

app.use(mainRouter.routes());
app.use(mainRouter.allowedMethods());

app.on('error', (err, ctx) => {
    console.log('ERROR OCCURED');
    console.error(err);
});

app.use(async (ctx, next) => {
    ctx.eventBus = eventBus;

    await next();
});

export default app;