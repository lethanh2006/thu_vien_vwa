export enum ETrangThaiGhiNhanAnPhamDinhKy {
	DANG_GHI_NHAN = 'Đang ghi nhận',
	DA_GHI_NHAN = 'Đã ghi nhận',
}

export const colorTrangThaiGhiNhanAnPhamDinhKy: Record<ETrangThaiGhiNhanAnPhamDinhKy, string> = {
	[ETrangThaiGhiNhanAnPhamDinhKy.DANG_GHI_NHAN]: 'blue',
	[ETrangThaiGhiNhanAnPhamDinhKy.DA_GHI_NHAN]: 'green',
};
