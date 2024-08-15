import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getHocTapHienTai(sinhVienSsoId: string) {
	return axios.get(`${ip3}/sinh-vien/${sinhVienSsoId}/thong-tin-hoc-tap-hien-tai`);
}

export const getThongTinSinhVienBySsoId = (ssoId: string) => axios.get(`${ip3}/sinh-vien/${ssoId}/info`);
