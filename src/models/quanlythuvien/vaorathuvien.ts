import useInitModel from '@/hooks/useInitModel';
import {
	getSoLuotCheckInKhoa,
	getSoLuotCheckInNganh,
	getSoLuotCheckInThang,
	getSoLuotCheckInTop,
	postCauHinhThuVien,
	postRaVaoThuVien,
} from '@/services/QuanLyThuVien';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
import { ipSlink } from '@/utils/ip';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<QuanLyThuVien.IVaoRaThuVien>('ql-thu-vien', undefined, undefined, ipSlink, {
		thoiGianCheckIn: -1,
	});
	const { formSubmiting, setFormSubmiting, getModel } = objInit;
	const [loadingNganh, setLoadingNganh] = useState<boolean>(false);
	const [loadingTop, setLoadingTop] = useState<boolean>(false);
	const [loadingKhoa, setLoadingKhoa] = useState<boolean>(false);
	const [loadingThang, setLoadingThang] = useState<boolean>(false);
	const [dataThongKeCheckInNganh, setDataThongKeCheckInNganh] = useState<QuanLyThuVien.IThongKeCheckInNganh[]>([]);
	const [dataThongKeCheckInTop, setDataThongKeCheckInTop] = useState<QuanLyThuVien.IThongKeCheckInTop[]>([]);
	const [dataThongKeCheckInKhoa, setDataThongKeCheckInKhoa] = useState<QuanLyThuVien.IThongKeCheckInKhoa[]>([]);
	const [dataThongKeCheckInThang, setDataThongKeCheckInThang] = useState<QuanLyThuVien.IThongKeCheckInThang[]>([]);

	const postRaVaoThuVienModel = async (
		payLoad: {
			hoTen: string;
			maSinhVien: string;
			thoiGianVao: Date;
			thoiGianRa: Date;
		},
		getData?: any,
	): Promise<any> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await postRaVaoThuVien(payLoad);
			message.success('Thêm mới thành công');
			if (getData) {
				getData();
			} else {
				getModel();
			}
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const getSoLuotCheckInNganhModel = async (condition?: any, filters?: any[]): Promise<any> => {
		setLoadingNganh(true);
		try {
			const res = await getSoLuotCheckInNganh(condition, filters);
			setDataThongKeCheckInNganh(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingNganh(false);
		}
	};

	const getSoLuotCheckInTopModel = async (condition?: any, filters?: any[]): Promise<any> => {
		setLoadingTop(true);
		try {
			const res = await getSoLuotCheckInTop(condition, filters);
			setDataThongKeCheckInTop(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingTop(false);
		}
	};

	const getSoLuotCheckInKhoaModel = async (condition?: any, filters?: any[]): Promise<any> => {
		setLoadingKhoa(true);
		try {
			const res = await getSoLuotCheckInKhoa(condition, filters);
			setDataThongKeCheckInKhoa(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingKhoa(false);
		}
	};

	const getSoLuotCheckInThangModel = async (
		thang: number,
		nam: number,
		condition?: any,
		filters?: any[],
	): Promise<any> => {
		setLoadingThang(true);
		try {
			const res = await getSoLuotCheckInThang({ thang, nam, condition, filters });
			setDataThongKeCheckInThang(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingThang(false);
		}
	};

	const postCauHinhThuVienModel = async (payLoad: QuanLyThuVien.ICauHinhVaoRaThuVien, getData?: any): Promise<any> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await postCauHinhThuVien(payLoad);
			message.success('Thêm mới thành công');
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
		loadingNganh,
		loadingTop,
		loadingKhoa,
		loadingThang,
		dataThongKeCheckInNganh,
		dataThongKeCheckInTop,
		dataThongKeCheckInKhoa,
		dataThongKeCheckInThang,
		postRaVaoThuVienModel,
		getSoLuotCheckInNganhModel,
		getSoLuotCheckInTopModel,
		getSoLuotCheckInKhoaModel,
		getSoLuotCheckInThangModel,
		postCauHinhThuVienModel,
	};
};
