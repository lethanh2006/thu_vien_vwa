import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<AnPham.IThongTinAnPham>('thong-tin-an-pham');

	return {
		...objInit,
	};
};
