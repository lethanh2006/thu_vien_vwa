import useInitModel from '@/hooks/useInitModel';
import { postPhieuMuonTraSach } from '@/services/SachTaiLieu/PhieuMuonTra';
import type { PhieuMuonTra } from '@/services/SachTaiLieu/PhieuMuonTra/typing';
import { message } from 'antd';
import moment from 'moment';

export default () => {
	const objInit = useInitModel<PhieuMuonTra.IRecord>('phieu-muon-tra-an-pham');
	const { formSubmiting, setFormSubmiting } = objInit;

	// Lấy giờ hiện tại
	const currentHour = moment().hour();
	const ngoaiThoiGian = currentHour < 8 || currentHour >= 17;

	const postPhieuMuonTraSachModel = async (
		payLoad: PhieuMuonTra.IRecord,
		getData?: () => void,
	): Promise<PhieuMuonTra.IRecord> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await postPhieuMuonTraSach(payLoad);
			message.success('Thêm thành công');

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
		ngoaiThoiGian,
		postPhieuMuonTraSachModel,
	};
};
