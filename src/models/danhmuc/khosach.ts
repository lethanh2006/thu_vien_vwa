import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<DangTaiLieu.IRecord>('kho-sach');

	return {
		...objInit,
	};
};
