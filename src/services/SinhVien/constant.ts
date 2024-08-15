export enum EGioiTinh {
	Nam = 'Nam',
	Nu = 'Nữ',
}

export enum EHinhThucTuyenDung {
	THI_TUYEN = 'Thi tuyển',
	XET_TUYEN = 'Xét tuyển',
	HOP_DONG = 'Hơp đồng',
	BIET_PHAI = 'Biệt phái',
	DIEU_DONG = 'Điều động',
}

export enum EViTriViecLam {
	DUNG_NGANH = 'Có việc làm đúng ngành đào tạo',
	LIEN_QUAN = 'Có việc làm liên quan đến ngành đào tạo',
	KHONG_LIEN_QUAN = 'Có việc làm không liên quan đến ngành đào tạo',
	TIEP_TUC_HOC = 'Tiếp tục học',
	CHUA_CO = 'Chưa có việc làm',
}

export enum ENoiNgoaiTru {
	NOI_TRU = 'Nội trú',
	NGOAI_TRU = 'Ngoại trú',
}

export enum ELoaiNoiSinh {
	TRONG_NUOC = 'TRONG_NUOC',
	NUOC_NGOAI = 'NUOC_NGOAI',
}

export const TenLoaiNoiSinh: Record<ELoaiNoiSinh, string> = {
	[ELoaiNoiSinh.TRONG_NUOC]: 'Trong nước',
	[ELoaiNoiSinh.NUOC_NGOAI]: 'Nước ngoài',
};

export enum ETrangThaiThanhVienGiaDinh {
	DA_MAT = 'Đã mất',
	CO_THONG_TIN = 'Có thông tin',
	KHONG_CO_THONG_TIN = 'Không có thông tin',
}
