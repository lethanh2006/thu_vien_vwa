import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<DangTaiLieu.IRecord>('dang-tai-lieu');

	return {
		...objInit,
	};
};
