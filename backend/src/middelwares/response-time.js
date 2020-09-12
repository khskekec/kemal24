import responseTime from 'koa-response-time';

export default () => responseTime({hrtime: true});