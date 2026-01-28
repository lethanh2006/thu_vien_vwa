import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const DangTaiLieuPage = () => {
	const intl = useIntl();
	const { page, limit, deleteModel, handleEdit } = useModel('danhmuc.dangtailieu');

	const columns: IColumn<DangTaiLieu.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'danhmuc.dangtailieu.table.column.madangtailieu' }),
			dataIndex: 'ma',
			width: 100,
			filterType: 'string',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.dangtailieu.table.column.tendangtailieu' }),
			dataIndex: 'ten',
			width: 180,
			filterType: 'string',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.dangtailieu.table.column.thaoTac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, record) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'danhmuc.dangtailieu.table.tooltip.chinhsua' })}
						onClick={() => handleEdit(record)}
						type='link'
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => deleteModel(record._id)}
						title={intl.formatMessage({ id: 'danhmuc.dangtailieu.table.popconfirm.xoa' })}
						placement='topRight'
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'danhmuc.dangtailieu.table.tooltip.xoa' })}
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
			modelName='danhmuc.dangtailieu'
			title={intl.formatMessage({ id: 'danhmuc.dangtailieu.title' })}
			Form={Form}
			buttons={{ import: true, export: true }}
		/>
	);
};

export default DangTaiLieuPage;
