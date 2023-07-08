import { Worker } from "worker_threads";
import { appendDataToStorage } from "../cache/cache";
import { config } from "../config";
import { log, parseToNumber } from "../utils";

export const retrieveDataFromSensor = () => {
	const sensorAmount = parseToNumber(config.SENSOR_AMOUNT);
	const sensors: Worker[] = [];

	for (let i = 0; i < sensorAmount; i++) {
		const sensor = new Worker(
			__dirname +
				`${
					config.NODE_ENV === "prod"
						? "/../sensor/sensorData.js"
						: "/../sensor/sensorData.ts"
				}`,
			{
				workerData: {
					sensorName: "Sensor " + i,
					sensorId: i,
				},
			}
		);

		sensor.on(
			"message",
			(message: { sensorName: string; sensorId: number; data: any }) => {
				log(
					`Received message from sensor ${i}: ${
						JSON.stringify(message).substring(0, 70) + "..."
					}`
				);
				// log(
				// 	`Received message from sensor ${i}: ${JSON.stringify(
				// 		message,
				// 		null,
				// 		2
				// 	)}`
				// );

				//  possible race condition on multiple sensor? -- testing needed -- if yes, fix needed
				appendDataToStorage({
					data: message.data,
				});
			}
		);

		sensors.push(sensor);
	}

	// Shutting down Workers
	process.on("SIGINT", () => {
		log("Received SIGINT. Shutting down sensors.");
		for (const sensor of sensors) {
			sensor.terminate();
		}
		log("All sensors shutted down.");
		process.exit(0);
	});
};
