import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import type { ETagMarc, ETruongConMarc } from '@/services/SachTaiLieu/constant';

/** Các giá trị của trường con thuộc tag MARC, bỏ giá trị rỗng */
export const getGiaTriMarc = (
	danhSachThongTin: AnPham.IThongTinAnPham[] | undefined,
	tagCode: ETagMarc,
	maTruongCon: ETruongConMarc,
) =>
	(danhSachThongTin ?? [])
		.filter((thongTin) => thongTin.tagCode === tagCode)
		.flatMap((thongTin) => thongTin.thuocTinhAnPham ?? [])
		.filter((truongCon) => truongCon.code === maTruongCon && truongCon.value)
		.map((truongCon) => truongCon.value);
