import { nanoid } from "nanoid";
import {
	DataDefaultValues,
	DataInfo,
	DataMetaInfo,
	LocalStorage,
	StoredData,
} from "../@types/data";
import { config } from "../config";
import { formatDataForPrint, log, parseToNumber } from "../utils";

const LOCAL_STORAGE: LocalStorage = [];
let dataCounter = 0;

/**
 * Adding data to local storage, to be used exclusively by sensorData.ts
 * @param props
 */
export const appendDataToStorage = (props: DataInfo) => {
	const uid = nanoid();
	const defaultValues = {
		dataTime: new Date().getTime(),
		dataUniqueId: uid,
		dataCounter: dataCounter,
	} as DataDefaultValues;

	const defaultMetadata = {
		retriesAmount: 0,
		lastSendTime: null,
		nextSendTime: new Date().getTime(),
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
	if (dataUniqueIds.length === 0) {
		return;
	}

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
	log(`Remove data with id ${dataUniqueIds} from storage.`);
	Object.assign(LOCAL_STORAGE, updatedLocalStorage);
};

export const updateDataOnStorageById = (dataUniqueIds: string[]) => {
	if (dataUniqueIds.length === 0) {
		return;
	}

	const updatedLocalStorage = LOCAL_STORAGE.map((d) => {
		if (dataUniqueIds.includes(d.dataUniqueId)) {
			const lastSendTime = new Date().getTime(); // now
			const nextSendTime =
				Math.pow(2, d.retriesAmount) *
					parseToNumber(config.BACKOFF_TIME_MS) +
				lastSendTime;

			const retriesAmount = d.retriesAmount + 1;
			log(
				`Update data ${formatDataForPrint(
					d
				)} SET retriesAmount: ${retriesAmount}, nextSendTime: ${new Date(
					nextSendTime
				).toLocaleTimeString()}`
			);
			return {
				...d,
				retriesAmount: retriesAmount,
				lastSendTime: lastSendTime,
				nextSendTime: nextSendTime,
			} as StoredData;
		}
		return d;
	});

	// Update the reference of LOCAL_STORAGE with the updated array
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
