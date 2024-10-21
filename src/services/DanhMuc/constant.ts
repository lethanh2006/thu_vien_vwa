import type { MauBienMuc } from './MauBienMuc/typing';

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

export const defaultElementBieuMau: MauBienMuc.IThongTinKhaiBao[] = [
	// { ten: 'Họ tên', isRequired: true },
	// { ten: 'Ngày sinh', type: ELoaiDuLieuBieuMau.Date, isRequired: true },
	// { ten: 'Mã sinh viên' },
];

export const allowElementBieuMau: MauBienMuc.IThongTinKhaiBao[] = [
	// { ten: 'Giới tính', type: ELoaiDuLieuBieuMau.Text },
	// { ten: 'Nơi sinh', type: ELoaiDuLieuBieuMau.Text },
	// { ten: 'Dân tộc', type: ELoaiDuLieuBieuMau.Text },
	// { ten: 'Hình thức đào tạo', type: ELoaiDuLieuBieuMau.Text },
	// { ten: 'Khóa', type: ELoaiDuLieuBieuMau.Text },
	// { ten: 'Ngành', type: ELoaiDuLieuBieuMau.Text },
	// { ten: 'Lớp', type: ELoaiDuLieuBieuMau.Text },
	// { ten: 'Trạng thái tốt nghiệp', type: ELoaiDuLieuBieuMau.Text },
	// { ten: 'Xếp loại', type: ELoaiDuLieuBieuMau.Text },
	// { ten: 'Năm tốt nghiệp', type: ELoaiDuLieuBieuMau.Text },
	// { ten: 'Người nhận', type: ELoaiDuLieuBieuMau.Text },
];
