// Implementation of Push/Pull for SensorData
// Edge server is producing data and send them to cloud server
import zeromq from "zeromq";
import { config } from "./config";
import { randomInt } from "crypto";

const socket = zeromq.socket("push");
socket.bindSync(config.CLOUD_TCP_SOCKET);
console.log("Producer bound to", config.CLOUD_TCP_SOCKET);

const index = () => {
	let i = 0;
	setInterval(
		function () {
			const info = randomInt(100)
			console.log(`sending work ${i}`, info);
			socket.send(`some work ${i}`, info);
			i++;
		},
		5000 // every 5000 ms
	);
};

index();
