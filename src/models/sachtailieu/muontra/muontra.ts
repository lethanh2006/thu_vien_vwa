import useInitModel from '@/hooks/useInitModel';
import type { ETrangThaiDuyetMuonSach } from '@/services/SachTaiLieu/constant';
import {
	getSetting,
	ghiTraThueMuonAnPham,
	giaHanThueMuonAnPham,
	thongKeAnPhamMuonTra,
	thongKeMuonTraSach,
	updateSetting,
	xuLyThueMuonAnPham,
} from '@/services/SachTaiLieu/MuonSach';
import type { MuonSach } from '@/services/SachTaiLieu/MuonSach/typing';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<MuonSach.IRecord>('thue-muon-an-pham');
	const { setLoading, setFormSubmiting, formSubmiting } = objInit;
	const [settingMuonTra, setSettingMuonTra] = useState<MuonSach.TSetting>();
	const [loadingThongKe, setLoadingThongKe] = useState<boolean>(false);
	const [dataThongKe, setDataThongKe] = useState<MuonSach.IThongKe>();
	const [dataThongKeAnPhamMuonTra, setDataThongKeAnPhamMuonTra] = useState<MuonSach.IThongKeAnPhamMuonTra[]>();

	const getSettingModel = async (): Promise<MuonSach.TSetting> => {
		setLoading(true);
		try {
			const res = await getSetting();
			setSettingMuonTra(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoading(false);
		}
	};

	const updateSettingModel = async (payLoad: Partial<MuonSach.TSetting>): Promise<MuonSach.TSetting> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await updateSetting(payLoad);
			message.success('Lưu thành công');

			getSettingModel();
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const xuLyThueMuonAnPhamModel = async (
		idThueMuon: string,
		payLoad: {
			trangThaiDuyet: ETrangThaiDuyetMuonSach;
			ghiChu: string;
			expired: Date;
			thoiGianMuon: Date;
			soDangKyCaBiet: string;
		},
		getData?: () => void,
	): Promise<MuonSach.IRecord> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await xuLyThueMuonAnPham(idThueMuon, payLoad);
			message.success('Lưu thành công');

			if (getData) getData();

			getSettingModel();
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const ghiTraThueMuonAnPhamModel = async (
		idThueMuon: string,
		payLoad?: {
			ghiChuTra: string;
		},
		getData?: () => void,
	): Promise<MuonSach.IRecord> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await ghiTraThueMuonAnPham(idThueMuon, payLoad);
			message.success('Lưu thành công');

			if (getData) getData();

			getSettingModel();
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const giaHanThueMuonAnPhamModel = async (
		idThueMuon: string,
		payLoad: {
			thoiGianGiaHan: string;
		},
		getData?: () => void,
	): Promise<MuonSach.IRecord> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await giaHanThueMuonAnPham(idThueMuon, payLoad);
			message.success('Lưu thành công');

			if (getData) getData();

			getSettingModel();
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const thongKeMuonTraSachModel = async (): Promise<MuonSach.IThongKe> => {
		setLoadingThongKe(true);
		try {
			const res = await thongKeMuonTraSach();
			setDataThongKe(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingThongKe(false);
		}
	};

	const thongKeAnPhamMuonTraModel = async (
		mode: 'ngay' | 'thang' | 'nam',
		isBanDoc?: boolean,
		condition?: any,
		filters?: any[],
	): Promise<MuonSach.IThongKeAnPhamMuonTra> => {
		setLoadingThongKe(true);
		try {
			const res = await thongKeAnPhamMuonTra(mode, isBanDoc, { condition, filters });
			setDataThongKeAnPhamMuonTra(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingThongKe(false);
		}
	};

	return {
		...objInit,
		dataThongKe,
		loadingThongKe,
		settingMuonTra,
		dataThongKeAnPhamMuonTra,
		setDataThongKeAnPhamMuonTra,
		getSettingModel,
		updateSettingModel,
		xuLyThueMuonAnPhamModel,
		ghiTraThueMuonAnPhamModel,
		giaHanThueMuonAnPhamModel,
		thongKeMuonTraSachModel,
		thongKeAnPhamMuonTraModel,
	};
};
