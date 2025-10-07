import type { AnPham } from '../AnPham/typing';
import type { ETrangThaiDuyetMuonSach, ETrangThaiMuonSach } from '../constant';
import type { PhieuMuonTra } from '../PhieuMuonTra/typing';

declare module MuonSach {
	export interface IRecord {
		_id: string;
		soDangKyCaBiet: string;
		thongTinAnPham: AnPham.IAnPhamXepGia;
		thoiGianMuon: Date;
		expired: Date;
		thoiGianTra: Date;
		anPhamId: string;
		anPham: AnPham.IRecord;
		ghiChuTra: string;
		daLaySach: boolean;
		giaHan: boolean;
		thoiGianGiaHan: Date;
		thoiGianMuonDuKien: Date;
		thoiGianTraDuKien: Date;
		phieuMuonTraId: string;
		phieuMuonTra: PhieuMuonTra.IRecord;
		trangThai: ETrangThaiMuonSach;
		createdAt: Date;
		updatedAt: Date;

		ghiChuDangKy: string;
		ghiChu: string;

		thoiGianDangKy: Date;

		//fake
		ssoId?: string;
	}

	export type TSetting = {
		_id?: string;
		thoiHanMuonTraSach: number;
		soLuongMuonToiDa: number;

		soLuongMuonToiDaCanBo: number;
		thoiHanMuonTraSachCanBo: number;

		idDonViThuVien: string;
	};

	export interface IThongKe {
		_id: string;
		choXuLy: number;
		daTra: number;
		dangThueMuon: number;
		quaHan: number;
	}

	export interface IThongKeAnPhamMuonTra {
		soLuong: string;
		title: string;
	}

	export interface IThongKeThueMuonAnPham {
		theoBanDoc: number;
		theoDauAnPham: number;
		theoDkcb: number;
		tongSoLuot: number;
	}
}
