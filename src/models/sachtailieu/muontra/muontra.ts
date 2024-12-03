import useInitModel from '@/hooks/useInitModel';
import { getSetting, updateSetting } from '@/services/SachTaiLieu/MuonSach';
import type { MuonSach } from '@/services/SachTaiLieu/MuonSach/typing';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<MuonSach.IRecord>('thue-muon-an-pham');
	const { setLoading, setFormSubmiting, formSubmiting } = objInit;
	const [settingMuonTra, setSettingMuonTra] = useState<MuonSach.TSetting>();

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

	return {
		...objInit,
		settingMuonTra,
		getSettingModel,
		updateSettingModel,
	};
};
