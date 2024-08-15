import { ip3, ipSlink } from '@/utils/ip';
import axios from 'axios';

export async function postRaVaoThuVien(payload: any) {
	return axios.post(`${ipSlink}/ql-thu-vien/chuyen-vien`, payload);
}

export async function exportDanhSachRaVaoThuVien(params?: {
	thoiGianBatDau?: Date;
	thoiGianKetThuc?: Date;
	condition?: any;
	filters?: any[];
}) {
	return axios.get(`${ipSlink}/ql-thu-vien/export/danh-sach`, {
		responseType: 'arraybuffer',
		params,
	});
}

export async function getSoLuotCheckInNganh(condition?: any, filters?: any[]) {
	return axios.get(`${ipSlink}/ql-thu-vien/nganh/so-luot-checkin`, {
		params: { condition, filters },
	});
}

export async function getSoLuotCheckInTop(condition?: any, filters?: any[]) {
	return axios.get(`${ipSlink}/ql-thu-vien/top/so-luot-checkin`, {
		params: { condition, filters },
	});
}

export async function getSoLuotCheckInKhoa(condition?: any, filters?: any[]) {
	return axios.get(`${ipSlink}/ql-thu-vien/khoa/so-luot-checkin`, {
		params: { condition, filters },
	});
}

export async function exportThongKe(
	type: 'thong-ke-khoa' | 'thong-ke-nganh' | 'thong-ke-thang' | 'top',
	condition?: any,
	filters?: any[],
	thang?: number,
	nam?: number,
) {
	return axios.get(`${ipSlink}/ql-thu-vien/export/${type}`, {
		params: { condition, filters, thang, nam },
		responseType: 'arraybuffer',
	});
}

export async function getSoLuotCheckInThang(data: { thang: number; nam: number; condition?: any; filters?: any[] }) {
	return axios.get(`${ipSlink}/ql-thu-vien/thang/so-luot-checkin`, {
		params: {
			...data,
		},
	});
}

export async function postCauHinhThuVien(payload: any) {
	return axios.post(`${ipSlink}/ql-thu-vien/setting`, payload);
}

export async function getSettingThuVien() {
	return axios.get(`${ip3}/quan-ly-la-lv-kl/setting`);
}

export async function postSettingThuVien(payLoad: any) {
	return axios.post(`${ip3}/quan-ly-la-lv-kl/setting`, payLoad);
}

export async function changeTrangThaiLuanAn(id: string, payLoad: any) {
	return axios.put(`${ip3}/quan-ly-la-lv-kl/${id}/status`, payLoad);
}

export async function exportThuVien(id: string, type: 'khoa-luan-do-an' | 'luan-an' | 'luan-van') {
	return axios.get(`${ip3}/quan-ly-la-lv-kl/export/${type}/${id}`, {
		responseType: 'arraybuffer',
	});
}
