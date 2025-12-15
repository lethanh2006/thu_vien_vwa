import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function saoChepMauBienMuc(id: string) {
	return axios.post(`${ip3}/mau-bien-muc/duplicate/${id}`);
}
