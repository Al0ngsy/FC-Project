// Edge server is producing data and send them to cloud server

import { retrieveDataFromSensor } from "./task/retrieveDataFromSensor";
import { sendDataToServer } from "./task/sendDataToServer";

const index = () => {
	retrieveDataFromSensor();
	sendDataToServer();
};

index();
