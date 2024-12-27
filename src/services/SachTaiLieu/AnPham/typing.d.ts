declare module AnPham {
	export interface IRecord {
		_id: string;
		ten: string;
		nhanDe: string;
		tacGia: string;

		createdAt?: Date;
		updatedAt?: Date;
	}

	export interface IThongTinAnPham {
		_id: string;
		anPhamId: string;
		anPham: IRecord;
		tagCode: string;
		tag: TruongBienMuc.IRecord;
		ind1: string;
		ind2: string;
		value: string;

		danhSachThuocTinhAnPham: IThuocTinhAnPham[];

		total?: number;

		createdAt?: Date;
		updatedAt?: Date;
	}

	export interface IThuocTinhAnPham {
		_id: string;
		thongTinAnPhamId: string;
		thongTinAnPham: IThongTinAnPham;
		code: TruongCon;
		thongTinCode: TruongCon.IRecord;
		value: string;

		createdAt?: Date;
		updatedAt?: Date;
	}

	export interface IThongKeAnPham {
		_id: string;
		tongAnPham: number;
		tongAnPhamDangThueMuon: number;
		tongSoAnPham: number;
	}
}
