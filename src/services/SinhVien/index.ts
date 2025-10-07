import axios from '@/utils/axios';
import { ipDaoTao } from '@/utils/ip';

export async function getHocTapHienTai(sinhVienSsoId: string) {
	return axios.get(`${ipDaoTao}/sinh-vien/${sinhVienSsoId}/thong-tin-hoc-tap-hien-tai`);
}

export const getThongTinSinhVienBySsoId = (ssoId: string) => axios.get(`${ipDaoTao}/sinh-vien/${ssoId}/info`);
