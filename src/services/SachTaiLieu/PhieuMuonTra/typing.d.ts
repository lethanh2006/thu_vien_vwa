import type { ETrangThaiDuyetMuonSach, EVaiTroMuonTra } from '../constant';
import type { MuonSach } from '../MuonSach/typing';

declare module PhieuMuonTra {
	export interface IRecord {
		_id: string;
		ghiChu: string;
		maHocKy: string;
		ghiChuDangKy: string;
		vaiTro: EVaiTroMuonTra;
		ssoIdNguoiMuon: string;
		maDinhDanhNguoiMuon: string;
		hoTenNguoiMuon: string;
		ssoIdNguoiDuyetChoMuon: string;
		maDinhDanhNguoiDuyetChoMuon: string;
		hoTenNguoiDuyetChoMuon: string;
		thoiGianDangKy: Date;
		trangThaiDuyet: ETrangThaiDuyetMuonSach;

		maNganhNguoiMuon: string;
		tenNganhNguoiMuon: string;
		maKhoaSinhVienNguoiMuon: string;
		tenKhoaSinhVienNguoiMuon: string;
		maKhoaNguoiMuon: string;
		tenKhoaNguoiMuon: string;

		maDonViNguoiMuon: string;
		tenDonViNguoiMuon: string;

		thoiGianDuyetXacNhan: Date;

		danhSachAnPhamMuonTra?: MuonSach.IRecord;

		createdAt: Date;
		updatedAt: Date;
	}
}
