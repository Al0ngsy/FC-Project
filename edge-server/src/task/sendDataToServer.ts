import { secondsToMilliseconds } from "date-fns";
import fetch from "node-fetch";
import {
	LocalStorage,
	removeDataFromStorageById,
	retrieveDataFromStorage,
	updateDataOnStorageById,
} from "../cache/cache";
import { config } from "../config";
import { wait } from "../utils";

export const sendDataToServer = async () => {
	const dataToBeSent = retrieveDataFromStorage();
	// once sending was successfully, we want to remove them from localStorage to prevent resending
	const dataToBeRemovedFromStorage: LocalStorage = [];
	// if sending failed for any reason, we want to update the data in storage for the next send out
	const dataToBeUpdatedInStorage: LocalStorage = [];

	for (const data of dataToBeSent) {
		// sending data to server via http
		const serverUrl = `${config.SERVER_URL}${
			config.SERVER_PORT ? `:${config.SERVER_PORT}` : ""
		}${config.SERVER_DATA_RECEIVER_ENDPOINT_API}`;

		try {
			const res = await fetch(serverUrl, {
				method: "post",
				headers: {
					"Content-Type": data.dataContentType,
				},
				body: data.data,
			});

			if (res.ok) {
				// equal to 200 <= res.status && res. status < 300
				// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#successful_responses
				dataToBeRemovedFromStorage.push(data);
			} else {
				console.error(
					`Received non 2xx response code from server ${res.status} ${res.statusText} for id`,
					data.dataUniqueId
				);
				dataToBeUpdatedInStorage.push(data);
			}
		} catch (error) {
			console.error(
				"Error encounted on sending data with id",
				data.dataUniqueId,
				error
			);
			dataToBeUpdatedInStorage.push(data);
		}
	}

	// removing successfully sent data
	removeDataFromStorageById(
		dataToBeRemovedFromStorage.map((d) => d.dataUniqueId)
	);

	// update unsuccessfully sent data
	updateDataOnStorageById(
		dataToBeUpdatedInStorage.map((d) => d.dataUniqueId)
	);

	// recursive call to start the sending of data again every second
	await wait(secondsToMilliseconds(1));
	await sendDataToServer();
};
