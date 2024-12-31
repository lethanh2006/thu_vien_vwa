export enum ETrangThaiMuonSach {
	CHO_XU_LY = 'Chờ xử lý',
	DANG_THUE_MUON = 'Đang thuê mượn',
	DA_TRA = 'Đã trả',
	// KHONG_CHO_THUE_MUON = 'Không cho thuê mượn',
}

export const colorTrangThaiMuonSach: Record<ETrangThaiMuonSach, string> = {
	[ETrangThaiMuonSach.DANG_THUE_MUON]: 'blue',
	[ETrangThaiMuonSach.CHO_XU_LY]: 'orange',
	[ETrangThaiMuonSach.DA_TRA]: 'green',
	// [ETrangThaiMuonSach.KHONG_CHO_THUE_MUON]: 'red',
};

export enum ETrangThaiDuyeMuonSach {
	CHO_DUYET = 'Chờ duyệt',
	DA_DUYET = 'Đã duyệt',
	KHONG_DUYET = 'Không duyệt',
}

export const colorTrangThaiDuyeMuonSach: Record<ETrangThaiDuyeMuonSach, string> = {
	[ETrangThaiDuyeMuonSach.CHO_DUYET]: 'blue',
	[ETrangThaiDuyeMuonSach.DA_DUYET]: 'orange',
	[ETrangThaiDuyeMuonSach.KHONG_DUYET]: 'green',
};

export enum ETrangThaiBienMuc {
	CHO_BIEN_MUC = 'Chờ biên mục chi tiết',
	DA_BIEN_MUC = 'Đã biên mục chi tiết',
}

export const colorTrangThaiBienMuc: Record<ETrangThaiBienMuc, string> = {
	[ETrangThaiBienMuc.CHO_BIEN_MUC]: 'blue',
	[ETrangThaiBienMuc.DA_BIEN_MUC]: 'green',
};
