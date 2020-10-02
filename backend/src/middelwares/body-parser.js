import bodyParser from 'koa-bodyparser';

export default () => bodyParser({
    formLimit: '10mb',
    json: '10mb'
});