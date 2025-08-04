import { ip3 } from '@/utils/ip';
import axios from 'axios';

export async function bienMucAnPhamDinhKy(payLoad: any) {
	return axios.post(`${ip3}/an-pham-dinh-ky/bien-muc`, payLoad);
}

export async function thongKeAnPhamDinhKy() {
	return axios.get(`${ip3}/an-pham-dinh-ky/thong-ke`);
}

export async function thongKeGhiNhanAnPham(
	mode: 'ngay' | 'thang' | 'nam',
	params?: { condition?: any; filters?: any[] },
) {
	return axios.get(`${ip3}/an-pham-ghi-nhan/thong-ke/${mode}`, { params });
}
