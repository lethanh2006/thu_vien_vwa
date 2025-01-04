import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<KhoSach.IRecord>('kho-sach');

	return {
		...objInit,
	};
};
