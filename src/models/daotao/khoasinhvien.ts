import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<KhoaSinhVien.IRecord>('khoa-sinh-vien');

	return {
		...objInit,
	};
};
