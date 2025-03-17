import { ip3 } from '@/utils/ip';
import axios from 'axios';

export async function getChiTietAnPham(idAnPham: string) {
	return axios.get(`${ip3}/an-pham/${idAnPham}/tag`);
}

export async function getThongKeAnPham(params?: { condition?: any; filters?: any[] }) {
	return axios.get(`${ip3}/an-pham/thong-ke`, { params });
}

export async function thongKeDangKyCaBiet(params?: { condition?: any; filters?: any[] }) {
	return axios.get(`${ip3}/an-pham-xep-gia/thong-ke`, { params });
}

export async function thongKeXepGia(params?: { condition?: any; filters?: any[] }) {
	return axios.get(`${ip3}/xep-gia/thong-ke`, { params });
}

export async function bienMucSoLuoc(payLoad: any) {
	return axios.post(`${ip3}/an-pham/bien-muc-so-luoc`, payLoad);
}

export async function chinhSuaBienMucSoLuoc(idBienMuc: string, payLoad: any) {
	return axios.put(`${ip3}/an-pham/${idBienMuc}/bien-muc-so-luoc`, payLoad);
}

export async function bienMucChiTiet(idBienMuc: string, payLoad: any) {
	return axios.put(`${ip3}/an-pham/${idBienMuc}/bien-muc-chi-tiet`, payLoad);
}

export async function inMaBarCode(payLoad: any) {
	return axios.post(`${ip3}/an-pham/in-barcode`, payLoad);
}
