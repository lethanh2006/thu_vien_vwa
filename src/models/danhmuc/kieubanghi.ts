import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<KieuBanGhi.IRecord>('kieu-ban-ghi');

	return {
		...objInit,
	};
};
