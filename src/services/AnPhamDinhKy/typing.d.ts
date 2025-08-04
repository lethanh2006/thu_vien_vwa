import type { ETrangThaiGhiNhanAnPhamDinhKy } from './constant';

declare module AnPhamDinhKy {
	export interface IRecord {
		_id: string;
		maAnPhamDinhKy: string;
		ten: string;
		issn: string;
		kyXuatBanId: string;
		kyXuatBan: KyXuatBan.IRecord;
		mauBienMucId: string;
		mauBienMuc: MauBienMuc.IRecord;
		nhaXuatBan: string;
		noiXuatBan: string;
		namXuatBan: number;
		khuonKho: string;
		soTrang: number;
		dacDiemVatLy: string;
		ghiChu: string;
		tomTat: string;
		anhBiaUrl: string;
		canBoBienMuc: string;
		maDangTaiLieu: string;
		dangTaiLieu: DangTaiLieu.IRecord;
		createdAt: Date;
		updatedAt: Date;
		danhSachGhiNhan: GhiNhanAnPhamDinhKy[];
	}

	export interface GhiNhanAnPhamDinhKy {
		_id: string;
		soAnPhamDinhKy: string;
		anPhamDinhKyId: string;
		anPhamDinhKy: IRecord;
		nguonBoSungId: string;
		nguonBoSung: NguonBoSung.IRecord;
		khoSachId: string;
		khoSach: KhoSach.IRecord;
		soLuong: number;
		donGia: number;
		ghiChu: string;
		trangThaiGhiNhan: ETrangThaiGhiNhanAnPhamDinhKy;
		ngayGhiNhan: string;
	}

	export interface IThongKeAnPhamDinhKy {
		tongSoAnPhamDinhKy: number;
		tongSoAnPhamDinhKyGhiNhan: number;
	}

	export interface IThongKeGhiNhanAnPham {
		soLuong: string;
		title: string;
	}
}
