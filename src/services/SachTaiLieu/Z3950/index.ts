import { ipZ39050 } from '@/utils/ip';
import axios from 'axios';

export async function timKiemAnPhamZ3950(params: {
	query: string;
	host: string;
	port: number;
	database: string;
	field: string;
	max_records: number;
}) {
	return axios.get(`${ipZ39050}/api/search`, { params: params });
}
