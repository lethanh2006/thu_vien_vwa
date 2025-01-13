import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<MauBienMuc.IRecord>('mau-bien-muc');

	return {
		...objInit,
	};
};
