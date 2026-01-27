import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const KhoSachPage = () => {
	const intl = useIntl();
	const { page, limit, handleEdit, deleteModel } = useModel('danhmuc.phongdoc');

	const columns: IColumn<PhongDoc.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'danhmuc.phongdoc.table.column.maphongdoc' }),
			dataIndex: 'ma',
			width: 100,
			filterType: 'string',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.phongdoc.table.column.tenphongdoc' }),
			dataIndex: 'ten',
			width: 220,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.phongdoc.table.column.diachi' }),
			dataIndex: 'diaChi',
			width: 220,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.phongdoc.table.column.thaoTac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'danhmuc.phongdoc.table.tooltip.chinhsua' })}
						onClick={() => handleEdit(rec)}
						type='link'
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => deleteModel(rec._id)}
						title={intl.formatMessage({ id: 'danhmuc.phongdoc.table.popconfirm.xoa' })}
						placement='topRight'
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'danhmuc.phongdoc.table.tooltip.xoa' })}
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
			modelName='danhmuc.phongdoc'
			title={intl.formatMessage({ id: 'danhmuc.phongdoc.title' })}
			Form={Form}
			buttons={{ import: true, export: true }}
		/>
	);
};

export default KhoSachPage;
