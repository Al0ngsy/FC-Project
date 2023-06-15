// mocking a DB we save the incoming data from edge server
import { StoredData } from "../@types/data";
import { DBStorage } from "../@types/db";
import { log } from "../utils";

const DB: DBStorage = [];

export const dbAdd = (data: StoredData) => {
	const dbEntry = DB.find((s) => s.dataUniqueId === data.dataUniqueId);
	if (dbEntry) {
		log(
			`Duplicate id found. Item with id already exist in the DB ${
				dbEntry.dataUniqueId
			} arrived at ${new Date(dbEntry.createdTime).toLocaleTimeString()}`
		);
	}
	log(`Saving data with id ${data.dataUniqueId}`);
	DB.push({
		createdTime: new Date().getTime(),
		data: data.data,
		dataUniqueId: data.dataUniqueId,
	});
};
