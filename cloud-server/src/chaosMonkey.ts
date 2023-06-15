import Koa from "koa";
import { log } from "./utils";

export const chaosMonkey = (ctx: Koa.Context, next: Koa.Next) => {
	// Randomly decide whether to introduce chaos
	const shouldIntroduceChaos = Math.random() < 0.2;

	if (shouldIntroduceChaos) {
		// TODO: Introduce chaos (e.g., delay response, return an error, etc.)
		log("Chaos Monkey strikes!");
		ctx.throw(500, "Chaos Monkey strikes!");
	} else {
		// Pass control to the next middleware
		return next();
	}
};
