export const randomDelay = (min: number, max: number) => {
	return Math.random() * (max - min) + min;
};
