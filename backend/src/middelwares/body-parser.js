import bodyParser from 'koa-bodyparser';

export default () => bodyParser({
    jsonLimit: '10mb'
});