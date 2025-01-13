import useInitModel from '@/hooks/useInitModel';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';

export default () => {
	const objInit = useInitModel<AnPham.IAnPhamXepGia>('an-pham-sep-gia');

	return {
		...objInit,
	};
};
