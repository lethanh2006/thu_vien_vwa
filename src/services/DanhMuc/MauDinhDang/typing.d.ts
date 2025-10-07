import type { ELoaiMauDinhDang } from '../constant';

declare module MauDinhDang {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		noiDungMau: string;
		loai: ELoaiMauDinhDang;
	}
}
