import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const CapThuMucPage = () => {
	const intl = useIntl();
	const { page, limit, deleteModel, handleEdit } = useModel('danhmuc.capthumuc');

	const columns: IColumn<CapThuMuc.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'danhmuc.capthumuc.table.column.macapthumuc' }),
			dataIndex: 'ma',
			width: 100,
			filterType: 'string',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.capthumuc.table.column.tencapthumuc' }),
			dataIndex: 'ten',
			width: 180,
			filterType: 'string',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.capthumuc.table.column.thaoTac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, record) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'danhmuc.capthumuc.table.tooltip.chinhsua' })}
						onClick={() => handleEdit(record)}
						type='link'
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => deleteModel(record._id)}
						title={intl.formatMessage({ id: 'danhmuc.capthumuc.table.popconfirm.xoa' })}
						placement='topRight'
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'danhmuc.capthumuc.table.tooltip.xoa' })}
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
			modelName='danhmuc.capthumuc'
			title={intl.formatMessage({ id: 'danhmuc.capthumuc.title' })}
			Form={Form}
			buttons={{ import: true, export: true }}
		/>
	);
};

export default CapThuMucPage;
