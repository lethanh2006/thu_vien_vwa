import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useModel } from 'umi';
import Form from './components/Form';

const ThuVienQuocThe = () => {
	const { page, limit, handleEdit, deleteModel } = useModel('danhmuc.thuvienquocte');

	const columns: IColumn<Z3950.IMayChu>[] = [
		{
			title: 'Tên máy chủ',
			dataIndex: 'name',
			width: 180,
			filterType: 'string',
		},
		{
			title: 'Cổng (Port)',
			dataIndex: 'port',
			width: 80,
			filterType: 'string',
		},
		{
			title: 'Máy chủ (Host)',
			dataIndex: 'host',
			width: 80,
			filterType: 'string',
		},
		{
			title: 'Cơ sở dữ liệu',
			dataIndex: 'database',
			width: 120,
			filterType: 'string',
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
			modelName='danhmuc.thuvienquocte'
			title='Danh sách máy chủ thư viện quốc tế'
			Form={Form}
		/>
	);
};

export default ThuVienQuocThe;
