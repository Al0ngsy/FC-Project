export const config = {
	SERVER_URL: process.env.LB_IP || "http://localhost",
	SERVER_PORT: process.env.PORT || 5559,
	SERVER_DATA_RECEIVER_ENDPOINT_API:
		process.env.SERVER_DATA_RECEIVER_ENDPOINT_API || "/save/data",
	BACKOFF_TIME_MS: process.env.BACKOFF_TIME || 3000,
};
