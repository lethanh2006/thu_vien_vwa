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

/** Xuất thống kê đăng ký tổng quát */
export async function thongKeDangKyTongQuat(
	maHocKy?: string,
	params?: {
		thoiGianBatDau?: string;
		thoiGianKetThuc?: string;
	},
) {
	return axios.get(`${ip3}/dot-nhap-sach/export-mau-so-dang-ky-tong-quat/${maHocKy}`, {
		params,
		responseType: 'arraybuffer',
	});
}

/** Xuất thống kê mẫu số đăng ký cá biệt */
export async function thongKeMauSoDKCB(dotNhapSachId: string) {
	return axios.get(`${ip3}/thong-tin-an-pham/export-mau-dang-ky-ca-biet/${dotNhapSachId}`, {
		responseType: 'arraybuffer',
	});
}

/** Xuất thống kê mẫu số đăng ký cá biệt */
export async function exportNhanMaGay(payLoad: any) {
	return axios.post(`${ip3}/an-pham/ma-vach/many/export`, payLoad, {
		responseType: 'arraybuffer',
	});
}

//Ấn phẩm số
export async function putAnPhamSo(idAnPham: string, payLoad: any) {
	return axios.put(`${ip3}/an-pham/sync-to-dspace/${idAnPham}`, payLoad);
}

export async function deleteAnPhamSo(idAnPham: string) {
	return axios.delete(`${ip3}/an-pham/dspace-item/${idAnPham}`);
}
