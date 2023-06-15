// Cloud server listen to REQ from edge server

import Koa from "koa";
import { koaBody } from "koa-body";
import KoaRouter from "koa-router";
import { StoredData } from "./@types/data";
import { chaosAfterMonkey, chaosMonkey } from "./chaosMonkey";
import { config } from "./config";
import { dbAdd } from "./db/database";

const app = new Koa();
const router = new KoaRouter();

router.post(
	"/save/data",
	chaosMonkey,
	koaBody(),
	async (ctx, next) => {
		const data = ctx.request.body as StoredData;
		dbAdd(data);
		ctx.status = 200;
		ctx.body = "ok";
		await next();
	},
	chaosAfterMonkey
);

app.use(router.routes());
app.listen(config.SERVER_PORT);
console.log(`app listen on port ${config.SERVER_PORT}`);
