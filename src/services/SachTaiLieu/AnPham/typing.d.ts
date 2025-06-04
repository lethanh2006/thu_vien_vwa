import type { GiaSach } from '@/services/DanhMuc/GiaSach/typing';
import type { ETrangThaiBienMuc, ETrangThaiDangKyCaBiet } from '../constant';

declare module AnPham {
	export interface IDotNhapSach {
		_id: string;
		ten: string;
		maNamHoc: string;
		maHocKy: string;
		thoiGianBatDau: Date | string;
		thoiGianKetThuc: Date | string;
		moTa: string;

		soChungTu?: string;
		ngayChungTu?: Date | string;
		nguonBoSungId?: string;
		nguonXuatNhap?: NguonBoSung.IRecord;

		maNguonBoSung: string;
		nguonBoSungId: string;
		nguonXuatNhap: {
			_id: string;
			ma: string;
			ten: string;
		};

		dotNhapSachMoi?: boolean;
	}

	export interface IRecord {
		_id: string;
		maTaiLieu: string;
		nhanDe: string;
		tacGia: string;
		tacGiaConverse: string;
		nhanDeConverse: string;

		canBoBienMuc: string;
		maKieuBanGhi: string;
		kieuBanGhi?: KieuBanGhi.IRecord;
		maCapThuMuc: string;
		capThuMuc?: CapThuMuc.IRecord;
		maDangTaiLieu: string;
		dangTaiLieu?: DangTaiLieu.IRecord;
		maVatMangTin: string;
		vatMangTin?: VatMangTin.IRecord;
		doMat: number;
		maNgonNgu: string;
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
		soTrang: string;
		dacDiemVatLy: string;
		khuonKho: string;
		tuLieuDiKem: string;
		nhaXuatBan: string;
		thongTinTaiLieu: MauBienMuc.IThongTinKhaiBao[];

		trangThai: ETrangThaiBienMuc;

		online: boolean;
		dpsaceId: string;
		collectionId: string;
		communityId: string;

		thongTinAnPhamTrucTuyen: TDanhSachTaiLieuTrucTuyen[];

		dotNhapSachId: string;
		dotNhapSach: IDotNhapSach;
		isSachHay: boolean;
		moTa: string;
		urlScanBia?: string;

		danhSachAnPhamVatLy?: IAnPhamXepGia[];
		danhSachThongTin?: IThongTinAnPham[];

		createdAt?: Date;
		updatedAt?: Date;

		//fake
		soDangKyCaBiet?: string;
	}

	export type TDanhSachTaiLieuTrucTuyen = {
		_id: string;
		index: number;
		ten: string;
		moTa: string;
		url: string | null;
	};

	export interface IThongTinAnPham {
		_id?: string;
		anPhamId?: string;
		anPham?: IRecord;
		tagCode?: string;
		tag?: TruongBienMuc.IRecord;
		ind1?: string;
		ind2?: string;
		value?: string;
		thuocTinhAnPham?: TThuocTinhAnPham[];

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
		maKhoSach: string;
		khoSach: KhoSach.IRecord;
		giaSachId: string;
		giaSach: GiaSach.IRecord;
		soDangKyCaBiet: string;
		soLuong: number;
		daXepGia: boolean;
		ghiChu: string;

		dotNhapSachId: string;
		dotNhapSach?: IDotNhapSach;
	}

	export interface IAnPhamXepGia {
		_id: string;
		soDangKyCaBiet: string;
		anPhamId: string;
		anPham: IRecord;
		thoiGianXepGia: Date;
		thongTinXepGiaId: string;
		thongTinXepGia: IXepGia;
		trangThai: ETrangThaiDangKyCaBiet;
	}

	export interface IThongKeAnPhamXepGia {
		tongSoAnPham: number;
		tongSoAnPhamDangThueMuon: number;
	}

	export interface IThongKeXepGia {
		daXepGia: number;
		chuaXepGia: number;
	}
}
