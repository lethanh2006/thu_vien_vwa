import useInitModel from '@/hooks/useInitModel';
import { thanhLyDangKyCaBiet, thongKeDangKyCaBiet } from '@/services/SachTaiLieu/AnPham';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { ETrangThaiDangKyCaBiet } from '@/services/SachTaiLieu/constant';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<AnPham.IAnPhamXepGia>('an-pham-xep-gia');
	const [loadingThongKe, setLoadingThongKe] = useState<boolean>(false);
	const [thongKeDKCB, setThongKeDKCB] = useState<AnPham.IThongKeAnPhamXepGia>();
	const [soDKCBRanh, setSoDKCBRanh] = useState<number>();
	const { formSubmiting, setFormSubmiting, getService } = objInit;

	const thongKeDangKyCaBietModel = async (condition?: any, filters?: any[]): Promise<any> => {
		setLoadingThongKe(true);
		try {
			const [resThongKe, resDKCBRanh] = await Promise.all([
				thongKeDangKyCaBiet({ condition, filters }),
				getService({ page: 1, limit: 1, condition: { ...condition, trangThai: ETrangThaiDangKyCaBiet.RANH } }, 'page'),
			]);
			setThongKeDKCB(resThongKe.data?.data);
			setSoDKCBRanh(resDKCBRanh.data?.data?.total);
			return resThongKe.data?.data;
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
		soDKCBRanh,
		thongKeDangKyCaBietModel,
		thanhLyDangKyCaBietModel,
	};
};
