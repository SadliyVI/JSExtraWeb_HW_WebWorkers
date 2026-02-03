const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const { slow } = require('./middleware/slow');
const news = require('./data/news.json');

const PORT = process.env.PORT || 4000;

const app = new Koa();
const router = new Router();

app.use(cors());

app.use(slow({ url: /^\/api\/news/i, delay: 2500 }));

router.get('/health', (ctx) => {
    ctx.body = { ok: true };
});

router.get('/api/news', (ctx) => {
    ctx.body = news;
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});