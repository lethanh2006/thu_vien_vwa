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
		createdAt: Date;
		updatedAt: Date;
		danhSachAnPhamDangKy: string[];
	}

	export type TSetting = {
		_id?: string;
		thoiHanMuonTraSach: number;
	};
}
