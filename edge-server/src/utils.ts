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
		return value; // No need for parsing, already a number
	}
	return Number(value); // Parse the string to a number
};
