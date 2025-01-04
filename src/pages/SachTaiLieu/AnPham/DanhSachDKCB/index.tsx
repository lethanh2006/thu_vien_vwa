import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import StatDanhSachDKCB from './components/Stat';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';

const DanhSachDKCB = () => {
	const { record: recAnPham } = useModel('sachtailieu.anpham.anpham');
	const { getModel, page, limit } = useModel('sachtailieu.anpham.thongtinanpham');

	const getData = () => {
		if (recAnPham?._id) getModel({ anPhamId: recAnPham?._id });
	};

	const columns: IColumn<AnPham.IThongTinAnPham>[] = [
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
			title: 'Chỉ thị 1',
			width: 80,
			dataIndex: 'ind1',
			align: 'center',
			filterType: 'string',
		},
		{
			title: 'Chỉ thị 2',
			width: 80,
			dataIndex: 'ind2',
			align: 'center',
			filterType: 'string',
		},
		{
			title: 'Đăng ký cá biệt',
			align: 'center',
			width: 90,
			render: (val, rec) => rec?.thuocTinhAnPham?.find((item) => item?.code === '$j')?.value,
		},
	];

	return (
		<>
			<StatDanhSachDKCB />

			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, recAnPham?._id]}
				modelName='sachtailieu.anpham.thongtinanpham'
				buttons={{ create: false }}
				hideCard
			/>
		</>
	);
};

export default DanhSachDKCB;
