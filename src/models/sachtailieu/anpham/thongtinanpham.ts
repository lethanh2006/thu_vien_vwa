import { EOperatorType } from '@/components/Table/constant';
import useInitModel from '@/hooks/useInitModel';
import type { AxiosResponse } from 'axios';
import _ from 'lodash';

export default () => {
	const objInit = useInitModel<AnPham.IThongTinAnPham>('thong-tin-an-pham');
	const { setLoading, getService, setDanhSach } = objInit;

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
		searchThongTinAnPhamModel,
	};
};
