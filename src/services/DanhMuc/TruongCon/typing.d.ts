declare module TruongCon {
	export interface IRecord {
		_id: string;
		tag: string;
		thongTinTag: TruongBienMuc.IRecord;
		tagCode: string;
		code: string;
		tieuDe: string;
		kieuDuLieu: string;

		createdAt?: Date;
		updatedAt?: Date;
	}
}
