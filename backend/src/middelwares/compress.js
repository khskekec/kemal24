import compress from 'koa-compress';

export default () => compress({
    filter: (content_type) => {
        return true;
    },
    threshold: 1,
    gzip: {
        flush: require('zlib').constants.Z_SYNC_FLUSH
    },
    deflate: {
        flush: require('zlib').constants.Z_SYNC_FLUSH,
    },
    br: true // disable brotli
})