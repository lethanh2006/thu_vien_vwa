import type { ETrangThaiHocSv } from '@/services/SinhVien/constant';
import type { ETrangThaiDuyetMuonSach, EVaiTroMuonTra } from '../constant';
import type { MuonSach } from '../MuonSach/typing';
import type { ETrangThaiNhanSu } from '@/services/ToChucNhanSu/constant';

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
		ngaySinhNguoiMuon: Date;
		ssoIdNguoiDuyetChoMuon: string;
		maDinhDanhNguoiDuyetChoMuon: string;
		hoTenNguoiDuyetChoMuon: string;
		thoiGianDangKy: Date;
		trangThaiDuyet: ETrangThaiDuyetMuonSach;

		//SinhVien
		maNganhNguoiMuon: string;
		tenNganhNguoiMuon: string;
		maKhoaSinhVienNguoiMuon: string;
		tenKhoaSinhVienNguoiMuon: string;
		maLopHanhChinhNguoiMuon: string;
		tenLopHanhChinhNguoiMuon: string;
		maKhoaNguoiMuon: string;
		tenKhoaNguoiMuon: string;
		trangThaiHoc: ETrangThaiHocSv;
		tenLopHanhChinh: string;

		//CanBo
		maDonViNguoiMuon: string;
		tenDonViNguoiMuon: string;
		trangThaiLamViec: ETrangThaiNhanSu;

		thoiGianDuyetXacNhan: Date;
		quaHanNgach: boolean;

		danhSachAnPhamMuonTra?: MuonSach.IRecord;

		createdAt: Date;
		updatedAt: Date;
	}
}
