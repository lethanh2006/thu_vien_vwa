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
		_id: string;
		mauBienMucId: string;
		tag: string;
		ten: string;
		thongTinTag?: TruongBienMuc.IRecord;
		thuocTinhDuLieu?: { code?: string; ten?: string; kieuDuLieu?: string }[];
	};
}
