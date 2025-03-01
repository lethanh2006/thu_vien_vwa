import { ip3 } from '@/utils/ip';
import axios from 'axios';

export async function getSetting() {
	return axios.get(`${ip3}/thue-muon-an-pham/setting`);
}

export async function updateSetting(payload: any) {
	return axios.put(`${ip3}/thue-muon-an-pham/setting`, payload);
}

export async function xuLyThueMuonAnPham(idThueMuon: string, payload: any) {
	return axios.put(`${ip3}/thue-muon-an-pham/${idThueMuon}/duyet`, payload);
}

export async function ghiTraThueMuonAnPham(idThueMuon: string, payload: any) {
	return axios.put(`${ip3}/thue-muon-an-pham/${idThueMuon}/tra`, payload);
}

export async function giaHanThueMuonAnPham(idThueMuon: string, payload: any) {
	return axios.put(`${ip3}/thue-muon-an-pham/${idThueMuon}/gia-han`, payload);
}

export async function thongKeMuonTraSach() {
	return axios.get(`${ip3}/thue-muon-an-pham/thong-ke`);
}

export async function thongKeAnPhamMuonTra(
	mode: 'ngay' | 'thang' | 'nam',
	isBanDoc?: boolean,
	params?: { condition?: any; filters?: any[] },
) {
	return axios.get(
		`${ip3}/${isBanDoc ? 'phieu-muon-tra-an-pham/thong-ke' : 'thue-muon-an-pham/an-pham-da-dang-ky/thong-ke'}/${mode}`,
		{ params },
	);
}

export async function exportThongKeTheMuon(params?: { condition?: any; filters?: any[] }) {
	return axios.get(`${ip3}/thue-muon-an-pham/muon-qua-han/export`, {
		responseType: 'arraybuffer',
		params,
	});
}
