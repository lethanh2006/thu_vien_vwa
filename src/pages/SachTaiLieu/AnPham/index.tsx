import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import CardFormAnPham from './components/CardForm';
import ChiTietAnPham from './components/ChiTiet';
// import Form from './components/Form';

const AnPhamPage = () => {
	const intl = useIntl();
	const { page, limit, deleteModel, handleEdit, handleView, isView } = useModel('sachtailieu.anpham.anpham');

	const onCell = (rec: AnPham.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<AnPham.IRecord>[] = [
		{
			title: 'Tên',
			dataIndex: 'ten',
			width: 180,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, record) => (
				<>
					<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					<Popconfirm
						onConfirm={() => deleteModel(record._id)}
						title='Bạn có chắc chắn muốn xóa thông tin này?'
						placement='topRight'
					>
						<ButtonExtend tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
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
			Form={isView ? ChiTietAnPham : CardFormAnPham}
			widthDrawer={1000}
		/>
	);
};

export default AnPhamPage;
