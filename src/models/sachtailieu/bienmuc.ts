import useInitModel from '@/hooks/useInitModel';
import { postBienMuc, putBienMucChiTiet } from '@/services/SachTaiLieu/BienMuc';
import type { BienMucSachTaiLieu } from '@/services/SachTaiLieu/BienMuc/typing';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<BienMucSachTaiLieu.IRecord>('tai-lieu');
	const { setFormSubmiting, formSubmiting, getModel } = objInit;

	const postBienMucModel = async (
		payLoad: Partial<BienMucSachTaiLieu.IRecord>,
		getData?: () => void,
	): Promise<BienMucSachTaiLieu.IRecord> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await postBienMuc(payLoad);
			message.success('Lưu thành công');

			if (getData) getData();
			else getModel();

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
			const res = await putBienMucChiTiet(id, payLoad);
			message.success('Lưu thành công');

			if (getData) getData();
			else getModel();

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		postBienMucModel,
		putBienMucChiTietModel,
	};
};
