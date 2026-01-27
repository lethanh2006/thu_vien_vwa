import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const ThuVienQuocThe = () => {
	const { page, limit, handleEdit, deleteModel } = useModel('danhmuc.thuvienquocte');

	const intl = useIntl();

	const columns: IColumn<Z3950.IMayChu>[] = [
		{
			title: intl.formatMessage({ id: 'danhmuc.thuvienquocte.table.column.tenmaychu' }),
			dataIndex: 'name',
			width: 180,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.thuvienquocte.table.column.cong' }),
			dataIndex: 'port',
			width: 80,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.thuvienquocte.table.column.maychu' }),
			dataIndex: 'host',
			width: 80,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.thuvienquocte.table.column.cosodulieu' }),
			dataIndex: 'database',
			width: 120,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.thuvienquocte.table.column.thaoTac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, record) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'danhmuc.thuvienquocte.table.tooltip.chinhsua' })}
						onClick={() => handleEdit(record)}
						type='link'
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => deleteModel(record._id)}
						title={intl.formatMessage({ id: 'danhmuc.thuvienquocte.table.popconfirm.xoa' })}
						placement='topRight'
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'danhmuc.thuvienquocte.table.tooltip.xoa' })}
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
			modelName='danhmuc.thuvienquocte'
			title={intl.formatMessage({ id: 'danhmuc.thuvienquocte.table.title' })}
			Form={Form}
		/>
	);
};

export default ThuVienQuocThe;
