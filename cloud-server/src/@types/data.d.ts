export type DataInfo = {
	dataContentType?: string; // See https://www.geeksforgeeks.org/http-headers-content-type/
	data: any; // The data, type of depend on dataContentType
};

export type DataDefaultValues = {
	dataTime: number; // When data was generated, in unix timestamp
	dataUniqueId: string; // Self-explaining
	dataCounter: number;
};

export type DataMetaInfo = {
	retriesAmount: number; // Indicates the number of times this data has been unsuccessfully sent to the server. Used for exponential retries.
	lastSendTime: number | null; // Self-explaining
	nextSendTime: number; // Self-explaining. Used for exponential retries.
};

export type StoredData = DataInfo & DataDefaultValues & DataMetaInfo;

export type LocalStorage = StoredData[];
