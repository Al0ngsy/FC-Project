import { StoredData } from "./@types/data";

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
