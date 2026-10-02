import { EOperatorType } from '@/components/Table/constant';
import useInitModel from '@/hooks/useInitModel';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import type { AxiosResponse } from 'axios';
import _ from 'lodash';
import { useRef, useState } from 'react';

export default () => {
	const objInit = useInitModel<AnPham.IThongTinAnPham>('thong-tin-an-pham');
	const { setLoading, getService, getAllService, setDanhSach, setRecord, setTotal } = objInit;
	const latestCatalogRequest = useRef(0);
	const [loadedAnPhamId, setLoadedAnPhamId] = useState<string>();
	const [catalogLoadError, setCatalogLoadError] = useState<string>();

	const getAllModel = async (
		...args: Parameters<typeof objInit.getAllModel>
	): ReturnType<typeof objInit.getAllModel> => {
		const [isSetRecord, sort, condition, filters, path, isSetDanhSach, select, otherQuery, config] = args;
		const request = ++latestCatalogRequest.current;
		setLoading(true);
		setLoadedAnPhamId(undefined);
		setCatalogLoadError(undefined);
		try {
			const payload = { condition, sort, filters, select: select?.join(' '), ...(otherQuery ?? {}) };
			const response = await getAllService(
				payload,
				path,
				config?.dataPartitionCode ? { 'x-data-partition-code': config.dataPartitionCode } : undefined,
			);
			const data: AnPham.IThongTinAnPham[] = response?.data?.data ?? [];
			if (request === latestCatalogRequest.current) {
				if (isSetDanhSach !== false) {
					setDanhSach(data);
					setLoadedAnPhamId(typeof condition?.anPhamId === 'string' ? condition.anPhamId : undefined);
				}
				if (isSetRecord) setRecord(data[0]);
			}
			return data;
		} catch (error) {
			if (request === latestCatalogRequest.current) {
				setCatalogLoadError('Không thể tải dữ liệu biên mục của ấn phẩm. Vui lòng thử tải lại.');
				if (isSetDanhSach !== false) {
					setDanhSach([]);
					setTotal(0);
				}
			}
			throw error;
		} finally {
			if (request === latestCatalogRequest.current) setLoading(false);
		}
	};

	const searchThongTinAnPhamModel = async (
		keyword: string,
		isSetDanhSach?: boolean,
		condition?: Partial<AnPham.IThongTinAnPham>,
	): Promise<AnPham.IThongTinAnPham[]> => {
		setLoading(true);
		try {
			const payloads = [
				{
					page: 1,
					limit: 20,
					condition,
					filters: [{ active: true, field: 'value', values: [keyword], operator: EOperatorType.CONTAIN }],
				},
			];
			const responses = await Promise.allSettled(payloads.map((payload) => getService(payload, 'page')));
			const data = (
				responses.filter((item) => item.status === 'fulfilled') as PromiseFulfilledResult<AxiosResponse<any>>[]
			).map((item) => item.value.data?.data?.result);
			const flatData: AnPham.IThongTinAnPham[] = data.flat();
			const uniqData = _.uniqBy(flatData, (item) => item._id);
			if (isSetDanhSach !== false) setDanhSach(uniqData);

			return uniqData;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		getAllModel,
		loadedAnPhamId,
		catalogLoadError,
		searchThongTinAnPhamModel,
	};
};
