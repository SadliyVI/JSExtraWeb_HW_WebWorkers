function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

function slow(options = {}) {
    const { url, delay = 1000 } = options;

    if (url && !(url instanceof RegExp)) {
        throw new Error(`slow(): "url" must be RegExp, got ${typeof url}`);
    }

    if (delay < 1) {
        throw new Error(`slow(): "delay" must be positive, got ${delay}`);
    }

    return async (ctx, next) => {
        if (!url || url.test(ctx.url)) {
            await sleep(delay);
        }
        await next();
    };
}

module.exports = { slow };