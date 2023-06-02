// Cloud server listen to REQ from edge server

import zmq from "zeromq";
import { config } from "./config";
import { randomInt } from "crypto";

const responder = zmq.socket('rep');

const tcpAdr = `tcp://${config.LB_IP}:${config.LB_PORT}`
console.log('connect to', tcpAdr)
responder.connect(tcpAdr);

responder.on('message', function(msg) {
  console.log('cloud received request:', msg.toString());
  setTimeout(function() {
    responder.send(msg.toString() + " World");
  }, 1000);
});