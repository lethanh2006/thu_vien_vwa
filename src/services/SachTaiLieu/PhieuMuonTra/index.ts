import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function postPhieuMuonTraSach(payLoad: any) {
	return axios.post(`${ip3}/phieu-muon-tra-an-pham/chuyen-vien/many`, payLoad);
}
