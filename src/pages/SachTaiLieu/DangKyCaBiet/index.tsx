import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { inputFormat } from '@/utils/utils';
import { Card } from 'antd';
import { useModel } from 'umi';
import StatDanhSachDKCB from '../AnPham/DanhSachDKCB/components/Stat';

const DangKyCaBietPage = () => {
	const { page, limit } = useModel('sachtailieu.anpham.anphamxepgia');

	const columns: IColumn<AnPham.IAnPhamXepGia>[] = [
		{
			title: 'Nhan đề',
			width: 180,
			render: (val, rec) => <ExpandText>{rec?.anPham?.nhanDe}</ExpandText>,
		},
		{
			title: 'Tác giả',
			width: 150,
			render: (val, rec) => rec?.anPham?.tacGia,
		},

		{
			title: 'ĐKCB',
			dataIndex: 'soDangKyCaBiet',
			align: 'center',
			width: 120,
			filterType: 'string',
		},
		{
			title: 'Đơn giá',
			width: 120,
			align: 'right',
			render: (val, rec) => `${inputFormat(rec?.thongTinXepGia?.donGia ?? 0)} VNĐ`,
		},
	];

	return (
		<Card title='Danh sách đăng ký cá biệt'>
			<StatDanhSachDKCB />

			<TableBase
				columns={columns}
				dependencies={[page, limit]}
				modelName='sachtailieu.anpham.anphamxepgia'
				buttons={{ create: false }}
				hideCard
			/>
		</Card>
	);
};

export default DangKyCaBietPage;
