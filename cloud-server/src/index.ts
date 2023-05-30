// Implementation of Push/Pull for SensorData
// Cloud server listen to pushes from edge server

import zeromq from "zeromq";
import { config } from "./config";

const socket = zeromq.socket("pull");
socket.connect(config.CLOUD_TCP_SOCKET);
console.log("Cloud worker bound to", config.CLOUD_TCP_SOCKET);

const index = () => {
	socket.on("message", function (msg) {
		console.log("work: %s", msg.toString());
	});
};

index();
