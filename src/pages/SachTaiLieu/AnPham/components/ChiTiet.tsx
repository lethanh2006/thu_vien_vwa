import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { useModel } from 'umi';

const ChiTietAnPham = () => {
	const { danhSach } = useModel('sachtailieu.anpham.thongtinanpham');

	const columns: IColumn<AnPham.IThongTinAnPham>[] = [
		{
			dataIndex: 'tagCode',
			align: 'center',
			width: 60,
		},
		{
			dataIndex: 'ind1',
			align: 'center',
			width: 60,
			render: (val, rec) => `${val ?? ''}${rec.ind2 ?? ''}`,
		},
		{
			dataIndex: 'thuocTinhAnPham',
			width: 220,
			render: (val) => val?.map((i: any) => `${i.code ?? ''}${i.value?.replace(/\u00A0/g, ' ') ?? ''}`).join(' '),
		},
	];

	return (
		<TableStaticData
			columns={columns}
			data={danhSach ?? []}
			otherProps={{ pagination: false, scroll: { y: 400 }, showHeader: false }}
		/>
	);
};

export default ChiTietAnPham;
