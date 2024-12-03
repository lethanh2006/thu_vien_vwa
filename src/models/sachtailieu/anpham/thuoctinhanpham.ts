import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<AnPham.IThuocTinhAnPham>('thuoc-tinh-an-pham');

	return {
		...objInit,
	};
};
