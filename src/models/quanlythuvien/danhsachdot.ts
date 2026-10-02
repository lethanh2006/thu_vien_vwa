import useInitModel from '@/hooks/useInitModel';
import { changeTrangThaiLuanAn, getSettingThuVien, postSettingThuVien } from '@/services/QuanLyThuVien';
import { ipLaLvKl } from '@/services/QuanLyThuVien/apiBase';
import { ELoaiDotQuanLyThuvien, type ETrangThaiNopThuVien } from '@/services/QuanLyThuVien/constants';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<QuanLyThuVien.IQuanLyDanhSachNop>('quan-ly-la-lv-kl', undefined, undefined, ipLaLvKl);
	const { setLoading, setFormSubmiting, formSubmiting } = objInit;
	const [settingThuVien, setSettingThuVien] = useState<QuanLyThuVien.settingThuVien>();
	const [loadingTrangThai, setLoadingTrangThai] = useState<boolean>(false);
	const [loai, setLoai] = useState<ELoaiDotQuanLyThuvien>(ELoaiDotQuanLyThuvien.LUAN_AN);

	const getSettingThuVienModel = async (): Promise<QuanLyThuVien.settingThuVien> => {
		setLoading(true);

		try {
			const res = await getSettingThuVien();
			setSettingThuVien(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoading(false);
		}
	};

	const postSettingThuVienModel = async (
		payLoad: Partial<QuanLyThuVien.settingThuVien>,
	): Promise<QuanLyThuVien.settingThuVien> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await postSettingThuVien(payLoad);
			message.success('Lưu thành công');

			getSettingThuVienModel();
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const changeTrangThaiLuanAnModel = async (
		id: string,
		payLoad: {
			trangThai: ETrangThaiNopThuVien;
		},
		getData?: () => void,
	): Promise<QuanLyThuVien.settingThuVien> => {
		setLoadingTrangThai(true);
		try {
			const res = await changeTrangThaiLuanAn(id, payLoad);
			message.success('Lưu thành công');
			if (getData) getData();
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingTrangThai(false);
		}
	};

	return {
		...objInit,
		loai,
		setLoai,
		loadingTrangThai,
		settingThuVien,
		getSettingThuVienModel,
		postSettingThuVienModel,
		changeTrangThaiLuanAnModel,
	};
};
