import useInitModel from '@/hooks/useInitModel';
import { saoChepMauBienMuc } from '@/services/DanhMuc/MauBienMuc';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<MauBienMuc.IRecord>('mau-bien-muc');
	const { formSubmiting, setFormSubmiting } = objInit;

	const saoChepMauBienMucModel = async (id: string, getData?: () => void): Promise<MauBienMuc.IRecord> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await saoChepMauBienMuc(id);
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
		saoChepMauBienMucModel,
	};
};
