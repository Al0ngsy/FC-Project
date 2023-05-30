// Implementation of Push/Pull for SensorData
// Edge server is producing data and send them to cloud server
import zeromq from "zeromq";
import { config } from "./config";

const socket = zeromq.socket("push");
socket.bindSync(config.CLOUD_TCP_SOCKET);
console.log("Producer bound to", config.CLOUD_TCP_SOCKET);

const index = () => {
	let i = 0;
	setInterval(
		function () {
			console.log("sending work", i);
			i++;
			socket.send("some work");
		},
		2000 // every 2000 ms
	);
};

index();
