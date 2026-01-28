import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const ThuVienPage = () => {
	const intl = useIntl();
	const { page, limit, deleteModel, handleEdit } = useModel('danhmuc.thuvien');

	const columns: IColumn<ThuVien.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'danhmuc.thuvien.table.column.tenviettat' }),
			dataIndex: 'tenVietTat',
			width: 120,
			filterType: 'string',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.thuvien.table.column.ten' }),
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.thuvien.table.column.diachi' }),
			dataIndex: 'diaChi',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.thuvien.table.column.thaoTac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, record) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'danhmuc.thuvien.table.tooltip.chinhsua' })}
						onClick={() => handleEdit(record)}
						type='link'
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => deleteModel(record._id)}
						title={intl.formatMessage({ id: 'danhmuc.thuvien.table.popconfirm.xoa' })}
						placement='topRight'
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'danhmuc.thuvien.table.tooltip.xoa' })}
							danger
							type='link'
							icon={<DeleteOutlined />}
						/>
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
