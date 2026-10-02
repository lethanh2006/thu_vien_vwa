import useInitModel from '@/hooks/useInitModel';
import { ipLaLvKl } from '@/services/QuanLyThuVien/apiBase';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';

export default () => {
	const objInit = useInitModel<QuanLyThuVien.IQuanLyDot>(
		'quan-ly-dot-nop-luan-van-luan-an-khoa-luan',
		undefined,
		undefined,
		ipLaLvKl,
	);

	return {
		...objInit,
	};
};
