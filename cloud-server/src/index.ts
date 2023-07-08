// Cloud server listen to REQ from edge server

import Koa from "koa";
import { koaBody } from "koa-body";
import KoaRouter from "koa-router";
import { StoredData } from "./@types/data";
import { chaosAfterMonkey, chaosMonkey } from "./chaosMonkey";
import { config } from "./config";
import { dbAdd } from "./db/database";
import { processSensorData } from "./task/processSensorData";
import { log } from "./utils";

const app = new Koa();
const router = new KoaRouter();

router.post(
	"/save/data",
	chaosMonkey,
	koaBody(),
	async (ctx, next) => {
		const data = ctx.request.body as StoredData;
		dbAdd(data);
		const result = processSensorData(data);
		log(
			`Result from processing data with id ${data.dataUniqueId} is ${result}. Return result.`
		);
		ctx.status = 200;
		ctx.body = {
			result,
		};
		await next();
	},
	chaosAfterMonkey
);

app.use(router.routes());
app.listen(config.SERVER_PORT);
console.log(`app listen on port ${config.SERVER_PORT}`);
