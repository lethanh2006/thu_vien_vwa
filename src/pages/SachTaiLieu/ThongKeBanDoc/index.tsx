import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { SinhVien } from '@/services/SinhVien/typings';
import { useModel } from 'umi';
import DanhSachBanDoc from './Components/DanhSach';

const ThongKeBanDocPage = () => {
	const { getModel, page, limit, handleView } = useModel('sachtailieu.muontra.danhsachbandoc');

	const getData = () => {
		getModel(undefined, undefined, undefined, undefined, undefined, 'thong-ke/sinh-vien');
	};

	const onCell = (rec: SinhVien.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<SinhVien.IRecord>[] = [
		{
			title: 'Mã SV',
			dataIndex: 'ma',
			align: 'center',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Họ tên',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'SL chờ xử lý',
			align: 'center',
			render: (val, rec) => rec?.thongKe?.choXuLy,
			width: 80,
			onCell,
		},
		{
			title: 'SL đang thuê mượn',
			align: 'center',
			render: (val, rec) => rec?.thongKe?.dangThueMuon,
			width: 80,
			onCell,
		},
		{
			title: 'SL đã trả',
			align: 'center',
			render: (val, rec) => rec?.thongKe?.daTra,
			width: 80,
			onCell,
		},
		{
			title: 'SL quá hạn',
			align: 'center',
			render: (val, rec) => rec?.thongKe?.quaHan,
			width: 80,
			onCell,
		},
	];

	return (
		<TableBase
			getData={getData}
			columns={columns}
			dependencies={[page, limit]}
			modelName='sachtailieu.muontra.danhsachbandoc'
			Form={DanhSachBanDoc}
			widthDrawer={1100}
			title='Thống kê bạn đọc'
			buttons={{ create: false }}
		/>
	);
};

export default ThongKeBanDocPage;
