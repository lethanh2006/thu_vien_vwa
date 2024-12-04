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
