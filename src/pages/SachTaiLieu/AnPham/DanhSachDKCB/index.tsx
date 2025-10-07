import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { inputFormat } from '@/utils/utils';
import { useModel } from 'umi';
import StatDanhSachDKCB from '../../DangKyCaBiet/components/Stat';

const DanhSachDKCB = () => {
	const { record: recAnPham } = useModel('sachtailieu.anpham.anpham');
	const { getModel, page, limit } = useModel('sachtailieu.anpham.anphamxepgia');

	const getData = () => {
		if (recAnPham?._id) getModel({ anPhamId: recAnPham?._id });
	};

	const columns: IColumn<AnPham.IAnPhamXepGia>[] = [
		{
			title: 'Nhan đề',
			width: 180,
			render: (val, rec) => <ExpandText>{recAnPham?.nhanDe}</ExpandText>,
		},
		{
			title: 'Tác giả',
			width: 150,
			render: (val, rec) => recAnPham?.tacGia,
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
		<>
			<StatDanhSachDKCB
				condition={{
					anPhamId: recAnPham?._id,
				}}
			/>

			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, recAnPham?._id]}
				modelName='sachtailieu.anpham.anphamxepgia'
				buttons={{ create: false }}
				hideCard
			/>
		</>
	);
};

export default DanhSachDKCB;
