import jwt from 'jsonwebtoken';

const fs = require('fs');

const privateKey  = fs.readFileSync('private.key', 'utf8');
const publicKey  = fs.readFileSync('public.key', 'utf8');

export default {
    sign: payload => jwt.sign(payload, privateKey, { expiresIn: process.env.TOKEN_EXPIRATION, algorithm:  "RS256" }),
    verify: token => jwt.verify(token, publicKey, { algorithm: ['RS256']})
}