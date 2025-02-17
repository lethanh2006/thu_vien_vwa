import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<DonViSo.IRecord>('communities');

	return {
		...objInit,
	};
};
