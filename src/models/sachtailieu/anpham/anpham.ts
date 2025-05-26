import { EOperatorType } from '@/components/Table/constant';
import useInitModel from '@/hooks/useInitModel';
import {
	bienMucChiTiet,
	bienMucSoLuoc,
	chinhSuaBienMucSoLuoc,
	getChiTietAnPham,
	getThongKeAnPham,
	timKiemAnPhamTuDen,
} from '@/services/SachTaiLieu/AnPham';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { timKiemAnPhamZ3950 } from '@/services/SachTaiLieu/Z3950';
import { message } from 'antd';
import type { AxiosResponse } from 'axios';
import _ from 'lodash';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<AnPham.IRecord>('an-pham');
	const [loadingChiTiet, setLoadingChiTiet] = useState<boolean>(false);
	const [loadingThongKe, setLoadingThongKe] = useState<boolean>(false);
	const [danhSachTag, setDanhSachTag] = useState<AnPham.IThongTinAnPham[]>([]);
	const [recBienMucChiTiet, setRecBienMucChiTiet] = useState<MauBienMuc.IThongTinKhaiBao>();
	const [dsAnPhamZ3950, setDSAnPhamZ3950] = useState<Z3950.IRecord[]>([]);

	const { setLoading, getService, setDanhSach, formSubmiting, setFormSubmiting } = objInit;

	const searchAnPhamModel = async (
		keyword: string,
		isSetDanhSach?: boolean,
		condition?: Partial<AnPham.IRecord>,
	): Promise<AnPham.IRecord[]> => {
		setLoading(true);
		try {
			const payloads = [
				{
					page: 1,
					limit: 20,
					condition,
					filters: [{ active: true, field: 'ten', values: [keyword], operator: EOperatorType.CONTAIN }],
				},
			];
			const responses = await Promise.allSettled(payloads.map((payload) => getService(payload, 'page')));
			const data = (
				responses.filter((item) => item.status === 'fulfilled') as PromiseFulfilledResult<AxiosResponse<any>>[]
			).map((item) => item.value.data?.data?.result);
			const flatData: AnPham.IRecord[] = data.flat();
			const uniqData = _.uniqBy(flatData, (item) => item._id);
			if (isSetDanhSach !== false) setDanhSach(uniqData);

			return uniqData;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const getChiTietAnPhamModal = async (idAnPham: string): Promise<AnPham.IRecord> => {
		setLoadingChiTiet(true);
		try {
			const res = await getChiTietAnPham(idAnPham);
			setDanhSachTag(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingChiTiet(false);
		}
	};

	const getThongKeAnPhamModel = async (condition?: any, filters?: any[]): Promise<any> => {
		setLoadingThongKe(true);
		try {
			const res = await getThongKeAnPham({ condition, filters });
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingThongKe(false);
		}
	};

	const postBienMucSoLuocModel = async (
		payLoad: Partial<AnPham.IRecord>,
		getData?: () => void,
	): Promise<AnPham.IRecord> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await bienMucSoLuoc(payLoad);
			message.success('Thêm mới thành công');

			if (getData) getData();

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const putBienMucSoLuocModel = async (
		idBienMuc: string,
		payLoad: Partial<AnPham.IRecord>,
		getData?: () => void,
	): Promise<AnPham.IRecord> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await chinhSuaBienMucSoLuoc(idBienMuc, payLoad);
			message.success('Lưu thành công');

			if (getData) getData();

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const putBienMucChiTietModel = async (id: string, payLoad: any, getData?: () => void): Promise<any> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await bienMucChiTiet(id, payLoad);
			message.success('Lưu thành công');

			if (getData) getData();

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const timKiemZ3950Model = async (
		query: string,
		host: string,
		port: number,
		database: string,
		field: string,
		max_records: number,
	): Promise<any> => {
		setLoading(true);
		try {
			const res = await timKiemAnPhamZ3950({
				query: query,
				host: host,
				port: port,
				database: database,
				field: field,
				max_records: max_records,
			});

			setDSAnPhamZ3950(res?.data?.records);
			return res?.data?.records;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoading(false);
		}
	};

	const timKiemAnPhamTuDenModel = async (payLoad?: {
		danhSachMaTaiLieu?: string[];
		danhSachSoDangKyCaBiet?: string[];
	}): Promise<any> => {
		setLoading(true);
		try {
			const res = await timKiemAnPhamTuDen(payLoad);

			setDanhSach(res?.data?.data);

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		loadingChiTiet,
		danhSachTag,
		loadingThongKe,
		recBienMucChiTiet,
		dsAnPhamZ3950,
		setDSAnPhamZ3950,
		setRecBienMucChiTiet,
		searchAnPhamModel,
		getChiTietAnPhamModal,
		getThongKeAnPhamModel,
		postBienMucSoLuocModel,
		putBienMucChiTietModel,
		putBienMucSoLuocModel,
		timKiemZ3950Model,
		timKiemAnPhamTuDenModel,
	};
};
