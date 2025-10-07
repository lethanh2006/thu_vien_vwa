import useInitModel from '@/hooks/useInitModel';
import { bienMucAnPhamDinhKy, thongKeAnPhamDinhKy } from '@/services/AnPhamDinhKy';
import type { AnPhamDinhKy } from '@/services/AnPhamDinhKy/typing';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<AnPhamDinhKy.IRecord>('an-pham-dinh-ky');
	const { formSubmiting, setFormSubmiting } = objInit;
	const [loadingThongKe, setLoadingThongKe] = useState<boolean>(false);
	const [dataThongKeAnPhamDinhKy, setDataThongKeAnPhamDinhKy] = useState<AnPhamDinhKy.IThongKeAnPhamDinhKy>();
	const [dsAllAnPhamDinhKy, setDsAllAnPhamDinhKy] = useState<AnPhamDinhKy.IRecord[]>([]);

	const postBienMucSoLuocModel = async (
		payLoad: Partial<AnPhamDinhKy.IRecord>,
		getData?: () => void,
	): Promise<AnPhamDinhKy.IRecord> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await bienMucAnPhamDinhKy(payLoad);
			message.success('Thêm mới thành công');

			if (getData) getData();

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const thongKeDangKyCaBietModel = async (): Promise<any> => {
		setLoadingThongKe(true);
		try {
			const res = await thongKeAnPhamDinhKy();
			setDataThongKeAnPhamDinhKy(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingThongKe(false);
		}
	};

	return {
		...objInit,
		postBienMucSoLuocModel,
		loadingThongKe,
		thongKeDangKyCaBietModel,
		dataThongKeAnPhamDinhKy,
		dsAllAnPhamDinhKy,
		setDsAllAnPhamDinhKy,
	};
};
