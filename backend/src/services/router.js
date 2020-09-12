import Router from '@koa/router';
import routeProvisioner from '../routes';

const mainRouter = new Router({
    'prefix': '/api/v1'
});

routeProvisioner(mainRouter);

export default mainRouter;