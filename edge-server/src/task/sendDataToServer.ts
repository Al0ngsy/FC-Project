import { secondsToMilliseconds } from "date-fns";
import fetch from "node-fetch";
import { LocalStorage } from "../@types/data";
import {
	removeDataFromStorageById,
	retrieveDataFromStorage,
	updateDataOnStorageById,
} from "../cache/cache";
import { config } from "../config";
import { formatDataForPrint, log, wait } from "../utils";

export const sendDataToServer = async () => {
	const dataToBeSent = retrieveDataFromStorage();
	log(
		`Sending data: ${JSON.stringify(
			dataToBeSent.map((d) => formatDataForPrint(d)),
			null,
			2
		)}`
	);

	// once sending was successfully, we want to remove them from localStorage to prevent resending
	const dataToBeRemovedFromStorage: LocalStorage = [];
	// if sending failed for any reason, we want to update the data in storage for the next send out
	const dataToBeUpdatedInStorage: LocalStorage = [];

	const promises = dataToBeSent.map(async (data) => {
		// sending data to server via HTTP
		const serverUrl = `${config.SERVER_URL}${
			config.SERVER_PORT ? `:${config.SERVER_PORT}` : ""
		}${config.SERVER_DATA_RECEIVER_ENDPOINT_API}`;

		try {
			const res = await fetch(serverUrl, {
				method: "post",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (res.ok) {
				// equal to 200 <= res.status && res. status < 300
				// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#successful_responses
				return { status: "fulfilled", data };
			} else {
				console.error(
					`Received non 2xx response code from server ${res.status} ${res.statusText}`,
					formatDataForPrint(data)
				);
				return { status: "rejected", data };
			}
		} catch (error) {
			console.error(
				"Error encountered on sending data",
				formatDataForPrint(data)
			);
			// console.error(error);
			return { status: "rejected", data };
		}
	});

	const results = await Promise.allSettled(promises);

	results.forEach((result) => {
		if (
			result.status === "fulfilled" &&
			result.value.status === "fulfilled"
		) {
			dataToBeRemovedFromStorage.push(result.value.data);
		} else {
			// @ts-ignore - stupid ts think this is an error
			dataToBeUpdatedInStorage.push(result.value.data);
		}
	});

	if (dataToBeRemovedFromStorage.length > 0) {
		// removing successfully sent data
		removeDataFromStorageById(
			dataToBeRemovedFromStorage.map((d) => d.dataUniqueId)
		);
	}

	if (dataToBeUpdatedInStorage.length > 0) {
		// update unsuccessfully sent data
		updateDataOnStorageById(
			dataToBeUpdatedInStorage.map((d) => d.dataUniqueId)
		);
	}
	// recursive call to start the sending of data again every second
	await wait(secondsToMilliseconds(1));
	await sendDataToServer();
};
