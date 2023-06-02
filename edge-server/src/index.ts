// Edge server is producing data and send them to cloud server (REP)

import zmq from "zeromq";
import { config } from "./config";
import { randomInt } from "crypto";

const requester = zmq.socket('req');

const tcpAdr = `tcp://${config.LB_IP}:${config.LB_PORT}`
console.log('connect to', tcpAdr)
requester.connect(tcpAdr);

var replyNbr = 0;
requester.on('message', function(msg) {
  console.log('got reply', replyNbr, msg.toString());
  replyNbr += 1;
});

let i = 0;
setInterval(
	function () {
		const msg = `Hello ${i}`
		console.log(`sending:`, msg);
		requester.send(msg);
		i++;
	},
	3000 // every 3000 ms
);