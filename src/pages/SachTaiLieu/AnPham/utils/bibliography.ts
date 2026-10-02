import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';

export const PUBLICATION_POPULATION = [
	{ path: 'dotNhapSach' },
	{
		path: 'danhSachThongTin',
		condition: { tagCode: { $in: ['245', '260', '082', '090', '650', '653'] } },
	},
	{ path: 'danhSachAnPhamVatLy', population: [{ path: 'thongTinXepGia' }] },
];

export const getMarcValues = (record: AnPham.IRecord, tagCode: string, subCodes: string[]) =>
	(record.danhSachThongTin ?? [])
		.filter((tag) => tag.tagCode === tagCode)
		.flatMap((tag) => tag.thuocTinhAnPham ?? [])
		.filter((field) => subCodes.includes(field.code))
		.map((field) => String(field.value ?? '').trim())
		.filter(Boolean);

export const getPublicationTitle = (record: AnPham.IRecord) => ({
	main: [
		getMarcValues(record, '245', ['$a']).join('; ') || record.nhanDeConverse || record.nhanDe || '',
		getMarcValues(record, '245', ['$n']).join('; ') || record.soThuTuCuaTap || '',
		getMarcValues(record, '245', ['$p']).join('; ') || record.tenTap || '',
	]
		.filter(Boolean)
		.join(' · '),
	additional: getMarcValues(record, '245', ['$b']),
});

const getSubjects = (record: AnPham.IRecord) =>
	(record.danhSachThongTin ?? [])
		.filter((tag) => tag.tagCode === '650')
		.map((tag) =>
			(tag.thuocTinhAnPham ?? [])
				.filter((field) => ['$a', '$x', '$y', '$z'].includes(field.code))
				.map((field) => String(field.value ?? '').trim())
				.filter(Boolean)
				.join(' — '),
		)
		.filter(Boolean)
		.join('; ');

export const getPublicationMetadata = (record: AnPham.IRecord) => ({
	noiXuatBan: getMarcValues(record, '260', ['$a']).join('; ') || record.noiXuatBan || '',
	namXuatBan: getMarcValues(record, '260', ['$c']).join('; ') || record.namXuatBan || '',
	nhaXuatBan: getMarcValues(record, '260', ['$b']).join('; ') || record.nhaXuatBan || '',
	phanLoai:
		getMarcValues(record, '090', ['$a']).join('; ') ||
		getMarcValues(record, '082', ['$a']).join('; ') ||
		record.chiSoPhanLoai ||
		'',
	chuDe: getSubjects(record),
	tuKhoa: getMarcValues(record, '653', ['$a']).join('; '),
});

export const getPublicationPriceRange = (record: AnPham.IRecord): [number, number] | undefined => {
	const prices = (record.danhSachAnPhamVatLy ?? [])
		.map((copy) => copy.thongTinXepGia?.donGia)
		.filter((price) => price !== null && price !== undefined && String(price).trim() !== '')
		.map(Number)
		.filter((price) => Number.isFinite(price) && price >= 0);
	if (!prices.length) return undefined;
	return [Math.min(...prices), Math.max(...prices)];
};
