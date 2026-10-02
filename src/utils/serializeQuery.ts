import qs from 'qs';

export const serializeQuery = (params: Record<string, unknown> = {}) => {
	const cleanedParams: Record<string, unknown> = {};
	Object.entries(params).forEach(([key, value]) => {
		if (value === undefined) return;
		cleanedParams[key] = Array.isArray(value)
			? value.map((item) => (item !== null && typeof item === 'object' ? JSON.stringify(item) : item))
			: typeof value === 'object'
				? JSON.stringify(value)
				: value;
	});
	return qs.stringify(cleanedParams, { arrayFormat: 'brackets' });
};
