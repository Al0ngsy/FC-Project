// Cloud server listen to REQ from edge server

import Koa from "koa";
import { koaBody } from "koa-body";
import KoaRouter from "koa-router";
import { StoredData } from "./@types/data";
import { chaosMonkey } from "./chaosMonkey";
import { config } from "./config";
import { formatDataForPrint, log } from "./utils";

const app = new Koa();
const router = new KoaRouter();

router.post("/save/data", chaosMonkey, koaBody(), (ctx) => {
	const data = ctx.request.body as StoredData;
	log(formatDataForPrint(data));

	// TODO: saving data?

	ctx.status = 200;
	ctx.body = "ok";
});

app.use(router.routes());
app.listen(config.SERVER_PORT);
console.log(`app listen on port ${config.SERVER_PORT}`);
