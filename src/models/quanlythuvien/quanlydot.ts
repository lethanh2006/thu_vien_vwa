import useInitModel from '@/hooks/useInitModel';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';

export default () => {
	const objInit = useInitModel<QuanLyThuVien.IQuanLyDot>('quan-ly-dot-nop-luan-van-luan-an-khoa-luan');

	return {
		...objInit,
	};
};
