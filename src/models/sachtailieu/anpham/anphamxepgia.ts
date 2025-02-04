import useInitModel from '@/hooks/useInitModel';
import { thongKeDangKyCaBiet } from '@/services/SachTaiLieu/AnPham';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<AnPham.IAnPhamXepGia>('an-pham-sep-gia');
	const [loadingThongKe, setLoadingThongKe] = useState<boolean>(false);
	const [thongKeDKCB, setThongKeDKCB] = useState<AnPham.IThongKeAnPhamXepGia>();

	const thongKeDangKyCaBietModel = async (condition?: any, filters?: any[]): Promise<any> => {
		setLoadingThongKe(true);
		try {
			const res = await thongKeDangKyCaBiet({ condition, filters });
			setThongKeDKCB(res.data?.data);
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
		thongKeDKCB,
		thongKeDangKyCaBietModel,
	};
};
