declare module TruongBienMuc {
	export interface IRecord {
		_id: string;
		ma: string;
		noiDung: string;
		ghiChu: string;
		thuocTinh: TruongCon.IRecord[];
		createdAt?: Date;
		updatedAt?: Date;
	}
}
