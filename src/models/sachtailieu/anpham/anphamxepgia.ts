import useInitModel from '@/hooks/useInitModel';
import { thanhLyDangKyCaBiet, thongKeDangKyCaBiet } from '@/services/SachTaiLieu/AnPham';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<AnPham.IAnPhamXepGia>('an-pham-xep-gia');
	const [loadingThongKe, setLoadingThongKe] = useState<boolean>(false);
	const [thongKeDKCB, setThongKeDKCB] = useState<AnPham.IThongKeAnPhamXepGia>();
	const { formSubmiting, setFormSubmiting } = objInit;

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

	const thanhLyDangKyCaBietModel = async (
		payLoad: {
			_id: string;
			thanhLy: boolean;
		},
		getData?: () => void,
	): Promise<any> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await thanhLyDangKyCaBiet(payLoad);
			message.success('Lưu thành công');

			if (getData) getData();

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		loadingThongKe,
		thongKeDKCB,
		thongKeDangKyCaBietModel,
		thanhLyDangKyCaBietModel,
	};
};
