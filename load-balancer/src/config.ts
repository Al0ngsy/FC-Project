export const config = {
	LB_PORT: process.env.PORT || 5559,
	LB_INTERNAL_PORT: process.env.INTERNAL_PORT || 5560,
	LB_IP: process.env.LB_IP || "localhost",
};
