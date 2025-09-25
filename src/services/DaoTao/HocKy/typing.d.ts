import type { NamHoc } from '@/services/NamHoc/NamHoc/typings';
import type { ELoaiHocLuc, ELoaiThoiGianNhapDiem, EValidateBuocThoiHoc, EValidateCanhBaoHocTap } from '../constant';

declare module HocKy {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		soThuTu: number;
		namHocId: string;
		namHoc?: NamHoc.IRecord;
		// maTrinhDoDaoTao: string;
		// trinhDoDaoTao?: TrinhDoDaoTao.IRecordCoSo;
		// maHinhThucDaoTao: string;
		// hinhThucDaoTao: HinhThucDaoTao.IRecordCoSo;

		thoiGianBatDau: string;
		soTuan: number;
		isKyChinh: boolean;
		// isToChucDangKyNhuCau: boolean;

		maNhomTietHoc: string;
		nhomTietHoc?: NhomTietHoc.IRecordCoSo;
		// sySoDuKienBatBuoc: number;
		// trinhDoDaoTaoId: string;
		// trinhDoDaoTao?: TrinhDoDaoTao.IRecordCoSo;
		// hinhThucDaoTaoId: string;
		// hinhThucDaoTao?: HinhThucDaoTao.IRecordCoSo;
		// sySoDuKienTuChon: number;

		loaiThoiGianNhapDiemHocKy: ELoaiThoiGianNhapDiem;
		thoiGianNhapDiemBatDau?: string;
		thoiGianNhapDiemKetThuc?: string;
		soNgayNhapDiem?: number;
		// Thời gian lấy ý kiến kế hoạch giảng dạy
		tgBdLayYKienKhgd?: string;
		tgKtLayYKienKhgd?: string;
		// Thời gian phân công giảng dạy
		tgBdPhanCongGiangDay?: string;
		tgKtPhanCongGiangDay?: string;
		soLuongPhanCongLopToiDa?: number;

		active?: boolean;
		namBatDau?: number;

		//Mở lớp tín chỉ
		soTinChiDangKyHocTuNguyen: number;
		soHocPhanDangKyHocTuNguyen: number;

		//Quy đổi giờ giảng
		daKhoiTaoQuyDoiGioGiangDay: boolean;

		daChotLopHocPhan?: boolean;
		/** Check đánh giá giảng viên trước khi cho sinh viên xem điểm? */
		danhGiaGvXemDiem?: boolean;

		kyHienTai?: boolean;
	}

	export interface IHocKyHocVu {
		_id: string;
		tenDot: string;
		maHocKy: string;
		hocKy?: IRecord;
		maHocKyCanhBao: string;
		hocKyCanhBao?: IRecord;

		// Đợt xét học vụ
		tgXetHvuSb?: string;
		tgTbKqXetHvuSb?: string;
		tgBdLayYKienHvu?: string;
		tgKtLayYKienHvu?: string;
		tgHopHoiDongHvu?: string;
		tgTbKqHvu?: string;
		validateCanhBao?: TValidateKetQuaHocTap[];
		validateBuocThoiHoc?: TValidateKetQuaHocTap[];
		daChotKqCanhBao?: boolean;
		daChotKqThoiHoc?: boolean;
		daGuiTBDanhSachCanhBaoSoBo?: boolean;
		daGuiTBDanhSachThoiHocSoBo?: boolean;
	}

	export interface IQuyDinhSoTinChiDangKy {
		_id: string;
		maHocKy: string;
		hocKy?: HocKy.IRecord;
		loaiHocLuc: ELoaiHocLuc;
		soTinChiToiThieu: number;
		soTinChiToiDa: number;
		soTinChiToiDaSongNganh: number;
	}

	export type TValidateKetQuaHocTap = {
		functionValidate: EValidateCanhBaoHocTap | EValidateBuocThoiHoc;
		thamSo: Partial<TThamSoValidate>;
		active: boolean;
	};

	export type TThamSoValidate = {
		isCoVanHocTap: boolean;
		maDonVi: string;

		//validateTongSoTinChiKhongDat
		phanTramTinChiKhongDat: number;

		//validateTongSoTinChiNoToanKhoa
		soTinChiNo: number;

		//validateDiemTrungBinhHocKy
		diemTbHocKy1: number;
		diemTbHocKyKhacKy1: number;

		//validateDiemTrungBinhTichLuy
		diemTrungBinhTichLuyNam1: number;
		diemTrungBinhTichLuyNam2: number;
		diemTrungBinhTichLuyNam3: number;
		diemTrungBinhTichLuyNamTiepTheo: number;

		//validateSoLanCanhBao
		soLan: number;
		cauHinhKyLuat: TCauHinhKyLuatCtsv[];

		//validateCanhBaoLienTiep
		soLanCanhBaoLienTiep: number;

		//validateTuBoHoc
		boQuaSinhVienHoanThanhChuongTrinh?: boolean;
		trungBinhTichLuyToiThieu?: number;

		//validateKyLuat
		// soLan: number;

		//validateKhongHoanThanhHocPhi
		// soLan: number;

		//validateThoiGianHoc
	};

	export interface INhanSuGiangDayHocKy {
		_id: string;
		nhanSuSsoId: string;
		hoTenNhanSu: string;
		maNhanSu: string;
		emailNhanSu: string;
		maHocKy: string;
		hocKy: IRecord;
		lichDay: TLichDay[];
	}

	export type TLichDay = {
		/** 0: thứ 2, 1: thứ 3... ~ `thuTrongTuan` */
		thu: number;
		tietBatDau: number;
		tietKetThuc: number;
	};

	export type TCauHinhKyLuatCtsv = {
		cauHinhId?: string;
		tenMau?: string;
		danhSachKyLuat?: string[];
	};
}
