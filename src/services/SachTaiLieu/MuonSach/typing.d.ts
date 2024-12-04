import type { ETrangThaiDuyeMuonSach, ETrangThaiMuonSach } from '../constant';

declare module MuonSach {
	export interface IRecord {
		_id: string;
		soDangKyCaBiet: string;
		thoiGianMuon: Date;
		thoiGianDangKy: Date;
		expired: number;
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
		thongTinAnPhamId: string;
		thongTinAnPham: AnPham.IThongTinAnPham;
		ghiChuTra: string;

		createdAt: Date;
		updatedAt: Date;
	}

	export type TSetting = {
		_id?: string;
		thoiHanMuonTraSach: number;
	};
}
