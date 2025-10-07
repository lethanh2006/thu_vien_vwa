import { ip3 } from '@/utils/ip';
import axios from '@/utils/axios';

export async function saoChepMauBienMuc(id: string) {
	return axios.post(`${ip3}/mau-bien-muc/duplicate/${id}`);
}
