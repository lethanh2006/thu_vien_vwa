import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { EyeOutlined } from '@ant-design/icons';
import { useIntl, useModel } from 'umi';
import ChiTietAnPham from './components/ChiTiet';
import Form from './components/Form';

const CardAnPham = () => {
	const intl = useIntl();
	const { page, limit, handleView, isView } = useModel('sachtailieu.anpham.anpham');

	const onCell = (rec: AnPham.IRecord) => ({
		onClick: () => handleView(rec),
		style: {
			cursor: 'pointer',
		},
	});

	const columns: IColumn<AnPham.IRecord>[] = [
		{
			title: 'Tên',
			dataIndex: 'ten',
			width: 120,
			render: (val, rec) => val ?? 'Không có thông tin',
			filterType: 'string',
			onCell,
		},
		{
			title: 'Nhan đề',
			dataIndex: 'nhanDe',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Tác giả',
			dataIndex: 'tacGia',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend tooltip='Chi tiết' onClick={() => handleView(rec)} type='link' icon={<EyeOutlined />} />
				</>
			),
		},
	];

	return (
		<TableBase
			columns={columns}
			dependencies={[page, limit]}
			modelName='sachtailieu.anpham.anpham'
			title={intl.formatMessage({ id: 'sachtailieu.anpham.title' })}
			Form={isView ? ChiTietAnPham : Form}
			widthDrawer={800}
			buttons={{ create: false }}
		/>
	);
};

export default CardAnPham;
