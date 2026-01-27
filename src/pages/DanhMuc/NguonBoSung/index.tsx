import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const KhoSachPage = () => {
	const intl = useIntl();
	const { page, limit, handleEdit, deleteModel } = useModel('danhmuc.nguonbosung');

	const columns: IColumn<NguonBoSung.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'danhmuc.nguonbosung.table.column.manguonbosung' }),
			dataIndex: 'ma',
			width: 100,
			filterType: 'string',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.nguonbosung.table.column.tennguonbosung' }),
			dataIndex: 'ten',
			width: 220,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.nguonbosung.table.column.thaoTac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'danhmuc.nguonbosung.table.tooltip.chinhsua' })}
						onClick={() => handleEdit(rec)}
						type='link'
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => deleteModel(rec._id)}
						title={intl.formatMessage({ id: 'danhmuc.nguonbosung.table.popconfirm.xoa' })}
						placement='topRight'
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'danhmuc.nguonbosung.table.tooltip.xoa' })}
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
			modelName='danhmuc.nguonbosung'
			title={intl.formatMessage({ id: 'danhmuc.nguonbosung.title' })}
			Form={Form}
			buttons={{ import: true, export: true }}
		/>
	);
};

export default KhoSachPage;
