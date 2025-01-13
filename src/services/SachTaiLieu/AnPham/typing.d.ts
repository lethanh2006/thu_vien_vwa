import type { GiaSach } from '@/services/DanhMuc/GiaSach/typing';
import type { ETrangThaiBienMuc } from '../constant';

declare module AnPham {
	export interface IRecord {
		_id: string;
		maTaiLieu: string;
		nhanDe: string;
		tacGia: string;
		tacGiaConverse: string;
		nhanDeConverse: string;

		kieuBanGhiId: string;
		kieuBanGhi?: KieuBanGhi.IRecord;
		capThuMucId: string;
		capThuMuc?: CapThuMuc.IRecord;
		dangTaiLieuId: string;
		dangTaiLieu?: DangTaiLieu.IRecord;
		vatMangTinId: string;
		vatMangTin?: VatMangTin.IRecord;
		doMat: number;
		mauBienMucId: string;
		mauBienMuc?: MauBienMuc.IRecord;
		ISBN: string;
		ISSN: string;
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

		trangThai: ETrangThaiBienMuc;

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
		thuocTinhAnPham: TThuocTinhAnPham[];

		total?: number;

		//fake
		soDangKyCaBiet?: string;

		createdAt?: Date;
		updatedAt?: Date;
	}

	export type TThuocTinhAnPham = {
		_id: string;
		code: string;
		value: string;
	};

	export interface IThongKeAnPham {
		_id: string;
		tongAnPham: number;
		tongAnPhamDangThueMuon: number;
		tongSoAnPham: number;
	}

	export interface IXepGia {
		_id: string;
		anPhamId: string;
		anPham: IRecord;
		maNguonBoSung: string;
		nguonBoSung: NguonBoSung.IRecord;
		maKieuTuLieu: string;
		kieuTuLieu: KieuTuLieu.IRecord;
		ngayBoSung: Date;
		donGia: number;
		thuVienId: string;
		thuVien: ThuVien.IRecord;
		khoSachId: string;
		khoSach: KhoSach.IRecord;
		giaSachId: string;
		giaSach: GiaSach.IRecord;
		soDangKyCaBien: string;
		soLuong: number;
		daXepGia: boolean;
	}

	export interface IAnPhamXepGia {
		_id: string;
		soDangKyCaBiet: string;
		anPhamId: string;
		anPham: IRecord;
		thoiGianXepGia: Date;
		thongTinXepGiaId: string;
		thongTinXepGia: IXepGia;
	}
}
