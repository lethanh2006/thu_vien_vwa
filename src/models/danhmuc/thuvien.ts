import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<ThuVien.IRecord>('thu-vien');

	return {
		...objInit,
	};
};
