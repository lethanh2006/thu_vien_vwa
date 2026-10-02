import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import type { ManualDKCBPayload } from '@/services/SachTaiLieu/DangKyCaBiet';

export type ManualDKCBValues = ManualDKCBPayload & { maKhoSach: string };

export function validateManualDKCBNumber(value: string, maKhoSach: string): string | undefined {
	const normalized = value?.trim().toUpperCase() ?? '';
	const parts = /^([^/]+)\/([0-9]+)$/.exec(normalized);
	if (!parts || !parts[2].replace(/^0+/, '')) return 'Nhập ĐKCB theo dạng MÃ KHO/SỐ THỨ TỰ lớn hơn 0.';
	if (!maKhoSach || parts[1] !== maKhoSach.trim().toUpperCase()) return 'Mã kho trong ĐKCB phải khớp với kho đã chọn.';
	const canonical = parts[2].replace(/^0+/, '').padStart(5, '0');
	if (parts[2] !== canonical) {
		return `Số thứ tự phải có tối thiểu 5 chữ số, không thừa số 0 đứng đầu. Ví dụ: ${parts[1]}/${canonical}.`;
	}
	return undefined;
}

export function buildManualDKCBPayload(
	values: ManualDKCBValues,
	khoSach: Pick<KhoSach.IRecord, 'ma'>[],
	xepGia: AnPham.IXepGia[],
): ManualDKCBPayload {
	if (!values.anPhamId) throw new Error('Chọn ấn phẩm cần thêm ĐKCB.');
	if (!khoSach.some((kho) => kho.ma === values.maKhoSach)) throw new Error('Chọn kho sách hợp lệ.');
	const numberError = validateManualDKCBNumber(values.soDangKyCaBiet, values.maKhoSach);
	if (numberError) throw new Error(numberError);
	if (values.thongTinXepGiaId) {
		const line = xepGia.find((item) => item._id === values.thongTinXepGiaId);
		if (!line?.daXepGia || line.anPhamId !== values.anPhamId || line.maKhoSach !== values.maKhoSach) {
			throw new Error('Dòng xếp giá phải đã xếp, thuộc đúng ấn phẩm và kho đã chọn.');
		}
	}
	return {
		anPhamId: values.anPhamId,
		soDangKyCaBiet: values.soDangKyCaBiet.trim().toUpperCase(),
		...(values.thongTinXepGiaId ? { thongTinXepGiaId: values.thongTinXepGiaId } : {}),
	};
}
