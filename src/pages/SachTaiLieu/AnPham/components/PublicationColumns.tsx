import type { IColumn } from '@/components/Table/typing';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { inputFormat } from '@/utils/utils';
import { getPublicationMetadata, getPublicationPriceRange } from '../utils/bibliography';

export const publicationMetadataColumns = (): IColumn<AnPham.IRecord>[] => [
	...[
		{ title: 'Nơi xuất bản', key: 'noiXuatBan', width: 140 },
		{ title: 'Năm xuất bản', key: 'namXuatBan', width: 100 },
		{ title: 'Nhà xuất bản', key: 'nhaXuatBan', width: 170 },
		{ title: 'Ký hiệu phân loại', key: 'phanLoai', width: 120 },
		{ title: 'Chủ đề', key: 'chuDe', width: 200 },
		{ title: 'Từ khoá', key: 'tuKhoa', width: 180 },
	].map((column) => ({
		...column,
		enableGlobalSearch: false,
		render: (_: unknown, record: AnPham.IRecord) =>
			getPublicationMetadata(record)[column.key as keyof ReturnType<typeof getPublicationMetadata>],
	})),
	{
		title: 'Giá tiền',
		key: 'giaTien',
		width: 160,
		align: 'right',
		enableGlobalSearch: false,
		render: (_, record) => {
			const range = getPublicationPriceRange(record);
			if (!range) return null;
			const [min, max] = range;
			return min === max ? `${inputFormat(min)} VNĐ` : `${inputFormat(min)}–${inputFormat(max)} VNĐ`;
		},
	},
];
