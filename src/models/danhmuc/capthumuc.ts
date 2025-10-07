import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<CapThuMuc.IRecord>('cap-thu-muc');

	return {
		...objInit,
	};
};
