import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const CardAnPham = () => {
	const intl = useIntl();
	const { getModel, page, limit, deleteModel, handleEdit, setRecord, record } = useModel('sachtailieu.anpham.anpham');

	const getData = () =>
		getModel().then((data) => {
			setRecord(data?.[0]);
		});

	const onCell = (rec: AnPham.IRecord) => ({
		onClick: () => setRecord(rec),
		style: {
			cursor: 'pointer',
			fontWeight: rec._id === record?._id ? 600 : undefined,
			backgroundColor: rec._id === record?._id ? 'var(--primary-1)' : undefined,
		},
	});

	const columns: IColumn<AnPham.IRecord>[] = [
		{
			title: 'Tên',
			dataIndex: 'ten',
			width: 180,
			render: (val, rec) => val ?? 'Không có thông tin',
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
					<Popconfirm
						onConfirm={() => deleteModel(rec._id, getData)}
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
			getData={getData}
			columns={columns}
			dependencies={[page, limit]}
			modelName='sachtailieu.anpham.anpham'
			title={intl.formatMessage({ id: 'sachtailieu.anpham.title' })}
			Form={Form}
			formProps={{ getData }}
			hideCard
		/>
	);
};

export default CardAnPham;
