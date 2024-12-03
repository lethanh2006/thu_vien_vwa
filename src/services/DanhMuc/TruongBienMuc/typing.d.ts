declare module TruongBienMuc {
	export interface IRecord {
		_id: string;
		ma: string;
		noiDung: string;
		ghiChu: string;
		thuocTinh: TDanhSachTruongCon[];
		createdAt?: Date;
		updatedAt?: Date;
	}

	export type TDanhSachTruongCon = {
		tagCode: string;
		code: string;
		tieuDe: string;
		kieuDuLieu: string;

		index: number;
	};
}
