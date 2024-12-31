import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';
import ExpandText from '@/components/ExpandText';

const ThuVienPage = () => {
	const intl = useIntl();
	const { page, limit, deleteModel, handleEdit } = useModel('danhmuc.thuvien');

	const columns: IColumn<ThuVien.IRecord>[] = [
		{
			title: 'Tên thư viện (viết tắt)',
			dataIndex: 'tenVietTat',
			width: 120,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Tên thư viện (đầy đủ)',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Địa chỉ',
			dataIndex: 'diaChi',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
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
			modelName='danhmuc.thuvien'
			title={intl.formatMessage({ id: 'danhmuc.thuvien.title' })}
			Form={Form}
			buttons={{ import: true, export: true }}
		/>
	);
};

export default ThuVienPage;
