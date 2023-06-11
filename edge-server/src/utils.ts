import { StoredData } from "./@types/data";

/**
 * Stop code from execution for specified amount of tiem in ms
 * @param ms
 * @returns
 */
export const wait = (ms: number) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

export const parseToNumber = (value: string | number): number => {
	if (typeof value === "number") {
		return value;
	}
	return Number(value);
};

export const formatDataForPrint = (data: StoredData) => {
	return `dataCounter: ${data.dataCounter}, dataUniqueId: ${
		data.dataUniqueId
	}, nextSendTime: ${new Date(data.nextSendTime).toLocaleTimeString()}`;
};

export const log = (msg: any) => {
	const now = new Date().toLocaleTimeString();
	console.log(
		`${now} - ${
			typeof msg === "string" ? msg : JSON.stringify(msg, null, 2)
		}`
	);
};
