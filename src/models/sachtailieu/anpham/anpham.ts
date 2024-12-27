import { EOperatorType } from '@/components/Table/constant';
import useInitModel from '@/hooks/useInitModel';
import { getChiTietAnPham, getThongKeAnPham } from '@/services/SachTaiLieu/AnPham';
import type { AxiosResponse } from 'axios';
import _ from 'lodash';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<AnPham.IRecord>('an-pham');
	const [loadingChiTiet, setLoadingChiTiet] = useState<boolean>(false);
	const [loadingThongKe, setLoadingThongKe] = useState<boolean>(false);
	const [danhSachTag, setDanhSachTag] = useState<AnPham.IThongTinAnPham[]>([]);

	const { setLoading, getService, setDanhSach } = objInit;

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

	return {
		...objInit,
		loadingChiTiet,
		danhSachTag,
		loadingThongKe,
		searchAnPhamModel,
		getChiTietAnPhamModal,
		getThongKeAnPhamModel,
	};
};
