import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<KieuTuLieu.IRecord>('kieu-tu-lieu');

	return {
		...objInit,
	};
};
