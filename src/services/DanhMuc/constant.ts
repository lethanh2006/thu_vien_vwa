export enum ELoaiDuLieuBieuMau {
	Text = 'String',
	Date = 'Date',
	Number = 'Number',
}

export const loaiDuLieuBieuMau: Record<ELoaiDuLieuBieuMau, string> = {
	[ELoaiDuLieuBieuMau.Text]: 'Chuỗi ký tự',
	[ELoaiDuLieuBieuMau.Number]: 'Kiểu số',
	[ELoaiDuLieuBieuMau.Date]: 'Ngày tháng',
};

export enum EPhuongGiaSach {
	NGANG = 'Ngang',
	DOC = 'Dọc',
}

export enum ELoaiMauDinhDang {
	MAU_BARCODE = 'Mẫu barcode',
	MAU_IN_GAY = 'Mẫu in gáy',
}
