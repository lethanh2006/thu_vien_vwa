export enum ETrangThaiMuonSach {
	// CHO_XU_LY = 'Chờ xử lý',
	DANG_THUE_MUON = 'Đang thuê mượn',
	DA_TRA = 'Đã trả',
	// KHONG_CHO_THUE_MUON = 'Không cho thuê mượn',
}

export const colorTrangThaiMuonSach: Record<ETrangThaiMuonSach, string> = {
	[ETrangThaiMuonSach.DANG_THUE_MUON]: 'blue',
	// [ETrangThaiMuonSach.CHO_XU_LY]: 'orange',
	[ETrangThaiMuonSach.DA_TRA]: 'green',
	// [ETrangThaiMuonSach.KHONG_CHO_THUE_MUON]: 'red',
};

export const mapNameTrangThaiMuonSach: Record<ETrangThaiMuonSach, string> = {
	// [ETrangThaiMuonSach.CHO_XU_LY]: 'Chờ xử lý',
	[ETrangThaiMuonSach.DANG_THUE_MUON]: 'Đang mượn',
	[ETrangThaiMuonSach.DA_TRA]: 'Đã trả',
	// [ETrangThaiMuonSach.KHONG_CHO_THUE_MUON]: 'red',
};

export enum ETrangThaiDuyetMuonSach {
	CHO_DUYET = 'Chờ duyệt',
	DA_DUYET = 'Đã duyệt',
	KHONG_DUYET = 'Không duyệt',
}

export const colorTrangThaiDuyeMuonSach: Record<ETrangThaiDuyetMuonSach, string> = {
	[ETrangThaiDuyetMuonSach.CHO_DUYET]: 'blue',
	[ETrangThaiDuyetMuonSach.DA_DUYET]: 'green',
	[ETrangThaiDuyetMuonSach.KHONG_DUYET]: 'orange',
};

export enum ETrangThaiBienMuc {
	CHO_BIEN_MUC = 'Chờ biên mục chi tiết',
	DA_BIEN_MUC = 'Đã biên mục chi tiết',
}

export const colorTrangThaiBienMuc: Record<ETrangThaiBienMuc, string> = {
	[ETrangThaiBienMuc.CHO_BIEN_MUC]: 'blue',
	[ETrangThaiBienMuc.DA_BIEN_MUC]: 'green',
};

export enum ETrangThaiDangKyCaBiet {
	RANH = 'Rảnh',
	BAN = 'Bận',
	// THANH_LY = 'Đã Thanh lý',
}

export const nameTrangThaiDangKyCaBietV2: Record<ETrangThaiDangKyCaBiet, string> = {
	[ETrangThaiDangKyCaBiet.RANH]: 'Rảnh',
	[ETrangThaiDangKyCaBiet.BAN]: 'Đang mượn',
	// [ETrangThaiDangKyCaBiet.THANH_LY]: 'Đã thanh lý',
};

export const nameTrangThaiDangKyCaBiet: Record<ETrangThaiDangKyCaBiet, string> = {
	[ETrangThaiDangKyCaBiet.RANH]: 'ĐKCB khả dụng',
	[ETrangThaiDangKyCaBiet.BAN]: 'ĐKCB cho mượn',
	// [ETrangThaiDangKyCaBiet.THANH_LY]: 'Đã thanh lý',
};

export const colorTrangThaiDangKyCaBiet: Record<ETrangThaiDangKyCaBiet, string> = {
	[ETrangThaiDangKyCaBiet.RANH]: 'green',
	[ETrangThaiDangKyCaBiet.BAN]: 'red',
	// [ETrangThaiDangKyCaBiet.THANH_LY]: 'orange',
};

export enum EVaiTroMuonTra {
	SINHVIEN = 'Sinh viên',
	CANBO = 'Cán bộ/ Giảng viên',
}

export enum EKieuHienThi {
	NAM = 'nam',
	THANG = 'thang',
	NGAY = 'ngay',
}

export const KieuHienThi = {
	[EKieuHienThi.NAM]: 'Năm',
	[EKieuHienThi.THANG]: 'Tháng',
	[EKieuHienThi.NGAY]: 'Ngày',
};
