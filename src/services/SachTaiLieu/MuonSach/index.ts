import { ip3 } from '@/utils/ip';
import axios from 'axios';

export async function getSetting() {
	return axios.get(`${ip3}/thue-muon-an-pham/setting`);
}

export async function updateSetting(payload: any) {
	return axios.put(`${ip3}/thue-muon-an-pham/setting`, payload);
}
