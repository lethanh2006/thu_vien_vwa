import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import SelectPhongDoc from '../PhongDoc/components/Select';
import Form from './components/Form';

const KhoSachPage = () => {
	const intl = useIntl();
	const { page, limit, handleEdit, deleteModel } = useModel('danhmuc.khosach');

	const columns: IColumn<KhoSach.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'danhmuc.khosach.table.column.makho' }),
			dataIndex: 'ma',
			width: 100,
			filterType: 'string',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.khosach.table.column.tenkho' }),
			dataIndex: 'ten',
			width: 220,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.khosach.table.column.phongdoc' }),
			dataIndex: 'maPhongDoc',
			width: 180,
			render: (val, rec) => rec?.phongDoc?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectPhongDoc multiple selectMa />,
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.khosach.table.column.sodkcbcuoi' }),
			dataIndex: 'soLuongAnPhamDaXepGia',
			width: 80,
			filterType: 'number',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.khosach.table.column.thaoTac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'danhmuc.khosach.table.tooltip.chinhsua' })}
						onClick={() => handleEdit(rec)}
						type='link'
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => deleteModel(rec._id)}
						title={intl.formatMessage({ id: 'danhmuc.khosach.table.popconfirm.xoa' })}
						placement='topRight'
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'danhmuc.khosach.table.tooltip.xoa' })}
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
			modelName='danhmuc.khosach'
			title={intl.formatMessage({ id: 'danhmuc.khosach.title' })}
			Form={Form}
			buttons={{ import: true, export: true }}
		/>
	);
};

export default KhoSachPage;
