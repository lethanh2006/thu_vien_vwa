import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<MauBienMuc.IThongTinKhaiBao>('mau-bien-muc/thong-tin-du-lieu');

	return {
		...objInit,
	};
};
