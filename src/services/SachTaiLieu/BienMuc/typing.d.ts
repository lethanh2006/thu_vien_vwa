import type { MauBienMuc } from '@/services/DanhMuc/MauBienMuc/typing';

declare module BienMucSachTaiLieu {
	export interface IRecord {
		_id: string;
		kieuBanGhiId: string;
		kieuBanGhi: KieuBanGhi.IRecord;
		capThuMucId: string;
		capThuMuc: CapThuMuc.IRecord;
		dangTaiLieuId: string;
		dangTaiLieu: DangTaiLieu.IRecord;
		vatMangTinId: string;
		vatMangTin: VatMangTin.IRecord;
		doMat: number;
		mauBienMucId: string;
		mauBienMuc: MauBienMuc.IRecord;
		ISBN: string;
		ISSN: string;
		tacGia: string;
		nhanDeChinh: string;
		soThuTuCuaTap: string;
		tenTap: string;
		nhanDeSongSong: string;
		phuDe: string;
		thongTinTrachNhiem: string;
		lanXuatBan: string;
		noiXuatBan: string;
		namXuatBan: number;
		soTrang: number;
		dacDiemVatLy: string;
		khuonKho: string;
		tuLieuDiKem: string;
		nhaXuatBan: string;
		thongTinTaiLieu: MauBienMuc.IThongTinKhaiBao[];
	}
}
