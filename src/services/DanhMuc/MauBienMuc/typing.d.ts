import type { ETypeThongTinKhaiBao } from '../constant';

declare module MauBienMuc {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		thongTinKhaiBao: IThongTinKhaiBao[];

		createdAt: string;
		updatedAt: string;
	}

	export type IThongTinKhaiBao = {
		ten: string;
		type?: ELoaiDuLieuBieuMau = ELoaiDuLieuBieuMau.Text;

		// Temp
		isRequired?: boolean = false;
		value?: string | number;
	};
}
