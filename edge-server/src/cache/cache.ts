import { nanoid } from "nanoid";
import { config } from "../config";
import { parseToNumber } from "../utils";

export type DataInfo = {
	dataContentType: string; // See https://www.geeksforgeeks.org/http-headers-content-type/
	data: any; // The data, type of depend on dataContentType
};

type DataDefaultValues = {
	dataTime: number; // When data was generated, in unix timestamp
	dataUniqueId: string; // Self-explaining
	dataCounter: number;
};

type DataMetaInfo = {
	retriesAmount: number; // Indicates the number of times this data has been unsuccessfully sent to the server. Used for exponential retries.
	lastSendTime: number | null; // Self-explaining
	nextSendTime: number; // Self-explaining. Used for exponential retries.
};

export type StoredData = DataInfo & DataDefaultValues & DataMetaInfo;

export type LocalStorage = StoredData[];

const LOCAL_STORAGE: LocalStorage = [];
let dataCounter = 0;

/**
 * Adding data to local storage, to be used exclusively by sensorData.ts
 * @param props
 */
export const appendDataToStorage = (props: DataInfo) => {
	const defaultValues = {
		dataTime: new Date().getTime(),
		dataUniqueId: nanoid(),
		dataCounter: dataCounter,
	} as DataDefaultValues;

	const defaultMetadata = {
		retriesAmount: 0,
		lastSendTime: null,
	} as DataMetaInfo;

	LOCAL_STORAGE.push({
		...props,
		...defaultValues,
		...defaultMetadata,
	});

	dataCounter += 1;
};

/**
 * Removing sent data by id, if data has been sent successfully
 * @param dataUniqueId
 */
export const removeDataFromStorageById = (dataUniqueIds: string[]) => {
	const dataToBeRemoved = LOCAL_STORAGE.find((d) =>
		dataUniqueIds.includes(d.dataUniqueId)
	);

	if (!dataToBeRemoved) {
		console.error(
			"Attempt to remove not existing data with id",
			dataUniqueIds,
			"Cancel remove process."
		);
		return;
	}

	const updatedLocalStorage = LOCAL_STORAGE.filter(
		(d) => !dataUniqueIds.includes(d.dataUniqueId)
	);

	// Update the reference of LOCAL_STORAGE with the updated array
	console.log("Remove data with id", dataUniqueIds, "from storage.");
	Object.assign(LOCAL_STORAGE, updatedLocalStorage);
};

export const updateDataOnStorageById = (dataUniqueIds: string[]) => {
	const updatedLocalStorage = LOCAL_STORAGE.map((d) => {
		if (dataUniqueIds.includes(d.dataUniqueId)) {
			return {
				...d,
				retriesAmount: d.retriesAmount + 1,
				lastSendTime: new Date().getTime(),
				nextSendTime:
					Math.pow(2, d.retriesAmount) *
						parseToNumber(config.BACKOFF_TIME_MS) +
					new Date().getTime(),
			} as StoredData;
		}
		return d;
	});

	// Update the reference of LOCAL_STORAGE with the updated array
	console.log("Update data with id", dataUniqueIds, "on storage.");
	Object.assign(LOCAL_STORAGE, updatedLocalStorage);
};

/**
 *
 * @param amount optional limit for amount of data entries from local storage that we want to send
 * @returns
 */
export const retrieveDataFromStorage = (amount?: number) => {
	const now = new Date().getTime();
	const dataToBeSent: LocalStorage = [];

	for (const data of LOCAL_STORAGE) {
		const { nextSendTime } = data;
		if (amount && dataToBeSent.length >= amount) {
			break;
		}
		if (nextSendTime <= now) {
			dataToBeSent.push(data);
		}
	}

	return dataToBeSent;
};
