import type { EPhuongGiaSach } from '../constant';

declare module GiaSach {
	export interface IRecord {
		_id: string;
		ten: string;
		khoSachId: string;
		khoSach: KhoSach.IRecord;
		chieuDai: number;
		chieuRong: number;
		phuong: EPhuongGiaSach;
		tungDo: number;
		hoachDo: number;
	}
}
