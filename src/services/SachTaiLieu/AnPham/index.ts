import { ip3 } from '@/utils/ip';
import axios from 'axios';

export async function getChiTietAnPham(idAnPham: string) {
	return axios.get(`${ip3}/an-pham/${idAnPham}/tag`);
}

export async function getThongKeAnPham(params?: { condition?: any; filters?: any[] }) {
	return axios.get(`${ip3}/an-pham/thong-ke`, { params });
}
