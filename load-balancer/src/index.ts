// Simple request-reply broker in Node.js

import zmq from "zeromq";
import { config } from "./config";

const frontend = zmq.socket('router')
const backend  = zmq.socket('dealer');

frontend.bindSync(`tcp://*:${config.LB_PORT}`);
backend.bindSync(`tcp://*:${config.LB_INTERNAL_PORT}`);

frontend.on('message', function() {
  // Note that separate message parts come as function arguments.
  // @ts-ignore
  var args = Array.apply(null, arguments);
  // Pass array of strings/buffers to send multipart messages.
  console.log(`${new Date().toISOString()} - Forwarding message from client to server`)
  backend.send(args);
});

backend.on('message', function() {
  // @ts-ignore
  var args = Array.apply(null, arguments);
  console.log(`${new Date().toISOString()} - Forwarding message from server to client`)
  frontend.send(args);
});