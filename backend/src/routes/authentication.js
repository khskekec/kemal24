import Router from '@koa/router';
import jwt from '../services/jwt';
import hash from '../services/hashing';

const router = new Router();

router.post('/login', async ctx => {
    const user = await ctx.db().User.findOne({
        where: {
            username: ctx.request.body.username,
            password: hash(ctx.request.body.password)
        }
    });

    if (!user) {
        ctx.throw(400, 'Unable to authenticate user with given credentials');
    }

    const token = jwt.sign({
        id: user.id,
        username: user.userName
    });

    ctx.cookies.set('token', token, { httpOnly: false });

    ctx.body = {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.userName,
        jwt: token
    };
});

export default mainRouter => {
    mainRouter.use('/auth', router.routes(), router.allowedMethods());
};