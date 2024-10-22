import { ip3 } from '@/utils/ip';
import axios from 'axios';

export async function postBienMuc(payload: any) {
	return axios.post(`${ip3}/tai-lieu/bien-muc-so-luoc`, payload);
}

export async function putBienMucChiTiet(id: string, payload: any) {
	return axios.put(`${ip3}/tai-lieu/${id}/bien-muc-chi-tiet`, payload);
}
