import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const VatMangTinPage = () => {
	const intl = useIntl();
	const { page, limit, deleteModel, handleEdit } = useModel('danhmuc.vatmangtin');

	const columns: IColumn<KieuBanGhi.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'danhmuc.vatmangtin.table.column.mavatmangtin' }),
			dataIndex: 'ma',
			width: 100,
			filterType: 'string',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.vatmangtin.table.column.tenvatmangtin' }),
			dataIndex: 'ten',
			width: 180,
			filterType: 'string',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.vatmangtin.table.column.thaoTac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, record) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'danhmuc.vatmangtin.table.tooltip.chinhsua' })}
						onClick={() => handleEdit(record)}
						type='link'
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => deleteModel(record._id)}
						title={intl.formatMessage({ id: 'danhmuc.vatmangtin.table.popconfirm.xoa' })}
						placement='topRight'
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'danhmuc.vatmangtin.table.tooltip.xoa' })}
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
			modelName='danhmuc.vatmangtin'
			title={intl.formatMessage({ id: 'danhmuc.vatmangtin.title' })}
			Form={Form}
			buttons={{ import: true, export: true }}
		/>
	);
};

export default VatMangTinPage;
