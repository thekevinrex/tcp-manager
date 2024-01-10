type CallbackType = (...params: any[]) => void;

export const useDebounce = (
	callback: CallbackType,
	wait: number
): CallbackType => {
	let timeout: NodeJS.Timeout | null = null;

	return (...params: any[]) => {
		if (timeout !== null) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(() => {
			callback(...params);
		}, wait);
	};
};

export default useDebounce;
