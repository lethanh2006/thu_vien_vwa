import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import _ from 'lodash';
import { useModel } from 'umi';

const ChiTietAnPham = () => {
	const { danhSach } = useModel('sachtailieu.anpham.thongtinanpham');

	const columns: IColumn<AnPham.IThongTinAnPham>[] = [
		{
			width: 150,
			render: (val, rec) => <ExpandText>{rec?.tag?.noiDung}</ExpandText>,
		},
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
			render: (val, rec) =>
				!!val?.length
					? val?.map((i: any) => `${i.code ?? ''}${i.value?.replace(/\u00A0/g, ' ') ?? ''}`).join(' ')
					: rec?.value,
		},
	];

	return (
		<TableStaticData
			columns={columns}
			data={_.sortBy(danhSach ?? [], ['tagCode'])}
			otherProps={{ pagination: false, scroll: { y: 500 }, showHeader: false }}
		/>
	);
};

export default ChiTietAnPham;
