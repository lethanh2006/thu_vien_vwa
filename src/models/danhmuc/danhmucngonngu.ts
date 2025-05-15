import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<DanhMucNgonNgu.IRecord>('danh-muc-ngon-ngu');

	return {
		...objInit,
	};
};
