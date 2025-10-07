import useInitModel from '@/hooks/useInitModel';
import { thongKeGhiNhanAnPham } from '@/services/AnPhamDinhKy';
import type { AnPhamDinhKy } from '@/services/AnPhamDinhKy/typing';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<AnPhamDinhKy.GhiNhanAnPhamDinhKy>('an-pham-ghi-nhan');
	const [loadingThongKe, setLoadingThongKe] = useState<boolean>(false);
	const [dataThongKeGhiNhanAnPham, setDataThongKeGhiNhanAnPham] = useState<AnPhamDinhKy.IThongKeGhiNhanAnPham[]>([]);

	const thongKeGhiNhanAnPhamModel = async (
		mode: 'ngay' | 'thang' | 'nam',
		condition?: any,
		filters?: any[],
	): Promise<any> => {
		setLoadingThongKe(true);
		try {
			const res = await thongKeGhiNhanAnPham(mode, { condition, filters });

			setDataThongKeGhiNhanAnPham(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingThongKe(false);
		}
	};

	return {
		...objInit,
		loadingThongKe,
		thongKeGhiNhanAnPhamModel,
		dataThongKeGhiNhanAnPham,
	};
};
