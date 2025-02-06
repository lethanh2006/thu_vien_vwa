import type { ETrangThaiDuyeMuonSach, ETrangThaiMuonSach } from '../constant';

declare module MuonSach {
	export interface IRecord {
		_id: string;
		soDangKyCaBiet: string;
		thoiGianMuon: Date;
		thoiGianDangKy: any;
		thoiGianMuonDuKien: Date;
		thoiGianTraDuKien: Date;
		expired: Date;
		thoiGianTra: Date;
		trangThaiDuyet: ETrangThaiDuyeMuonSach;
		trangThai: ETrangThaiMuonSach;
		ghiChu: string;
		ssoIdNguoiMuon: string;
		maDinhDanhNguoiMuon: string;
		hotenNguoiMuon: string;
		ssoIdNguoiDuyetChoMuon: string;
		maDinhDanhNguoiDuyetChoMuon: string;
		hotenNguoiDuyetChoMuon: string;

		anPhamId: string;
		anPham: AnPham.IRecord;
		ghiChuTra: string;
		ghiChuDangKy: string;
		daLaySach: boolean;
		giaHan: boolean;
		thoiGianGiaHan: Date;

		createdAt: Date;
		updatedAt: Date;

		//fake
		tacGia?: string;
		nhanDe?: string;
		dangKyCaBiet?: string;
	}

	export type TSetting = {
		_id?: string;
		thoiHanMuonTraSach: number;
		idDonViThuVien: string;
		soLuongMuonToiDa: number;
	};

	export interface IThongKe {
		_id: string;
		choXuLy: number;
		daTra: number;
		dangThueMuon: number;
		quaHan: number;
	}
}
