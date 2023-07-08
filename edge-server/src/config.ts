export const config = {
	NODE_ENV: process.env.NODE_ENV || "dev",
	SERVER_URL: process.env.SERVER_URL || "http://23.251.137.133",
	SERVER_PORT: process.env.PORT || 80, //5559,
	SERVER_DATA_RECEIVER_ENDPOINT_API:
		process.env.SERVER_DATA_RECEIVER_ENDPOINT_API || "/save/data",
	BACKOFF_TIME_MS: process.env.BACKOFF_TIME || 10000,
	SENSOR_AMOUNT: process.env.SENSOR_AMOUNT || 2,
};
