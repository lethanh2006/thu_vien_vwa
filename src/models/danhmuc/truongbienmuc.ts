import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<TruongBienMuc.IRecord>('tag');

	return {
		...objInit,
	};
};
