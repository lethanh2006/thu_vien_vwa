import { ip3 } from '@/utils/ip';
import axios from 'axios';

export async function postPhieuMuonTraSach(payLoad: any) {
	return axios.post(`${ip3}/phieu-muon-tra-an-pham/chuyen-vien/many`, payLoad);
}
