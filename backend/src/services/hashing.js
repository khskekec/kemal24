import crypto from 'crypto';

export default (pw, salt = null) =>
    crypto.pbkdf2Sync(pw, salt || process.env.CRYPTO_SALT, 1000, 64, `sha512`).toString(`hex`)