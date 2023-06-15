import { random } from "nanoid";
import { parentPort, workerData } from "worker_threads";
import { randomDelay } from "./sensorUtils";

const { sensorId, sensorName } = workerData;

const sendDataToMainThread = () => {
	const delay = randomDelay(500, 5000);

	setTimeout(() => {
		if (parentPort) {
			parentPort?.postMessage({
				sensorId,
				sensorName,
				data: new TextDecoder().decode(random(1000)), // in byte, 1000 -> 1kB Uint8Array
			});
		}
	}, delay);
};

setInterval(() => {
	sendDataToMainThread();
}, 3333);
