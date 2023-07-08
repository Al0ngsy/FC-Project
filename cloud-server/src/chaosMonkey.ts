import Koa from "koa";
import { log } from "./utils";

const randomErrorCode = () => {
	let randomStatusCode;
	do {
		randomStatusCode = Math.floor(Math.random() * 500) + 100;
	} while (randomStatusCode >= 200 && randomStatusCode < 300);
	return randomStatusCode;
};

export const chaosMonkey = (ctx: Koa.Context, next: Koa.Next) => {
	// Randomly decide whether to introduce chaos
	const shouldIntroduceChaos = Math.random() < 0.1;

	if (shouldIntroduceChaos) {
		log("Chaos Monkey strikes!");
		ctx.throw(randomErrorCode());
	} else {
		// Pass control to the next middleware
		return next();
	}
};

export const chaosAfterMonkey = async (ctx: Koa.Context, next: Koa.Next) => {
	// Randomly decide whether to introduce chaos
	const shouldIntroduceChaos = Math.random() < 0.1;
	if (shouldIntroduceChaos) {
		log("Chaos After Monkey strikes!");
		ctx.throw(randomErrorCode());
	}
};
