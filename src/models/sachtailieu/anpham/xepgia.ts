import useInitModel from '@/hooks/useInitModel';
import { thongKeXepGia } from '@/services/SachTaiLieu/AnPham';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<AnPham.IXepGia>('xep-gia');
	const [loadingThongKe, setLoadingThongKe] = useState<boolean>(false);
	const [datathongKeXepGia, setdataThongKeXepGia] = useState<AnPham.IThongKeXepGia>();

	const thongKeXepGiaModel = async (condition?: any, filters?: any[]): Promise<any> => {
		setLoadingThongKe(true);
		try {
			const res = await thongKeXepGia({ condition, filters });
			setdataThongKeXepGia(res.data?.data);
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
		datathongKeXepGia,
		thongKeXepGiaModel,
	};
};
