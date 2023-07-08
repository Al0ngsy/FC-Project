import { StoredData } from "../@types/data";

export const processSensorData = (data: StoredData) => {
	let totalSum = 0;

	for (let i = 0; i < data.data.length; i++) {
		let charCode = (data.data as string).charCodeAt(i);
		isNaN(charCode) === false ? (totalSum += charCode) : null;
	}

	return totalSum;
};
