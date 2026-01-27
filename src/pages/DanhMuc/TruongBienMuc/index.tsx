import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import CardFormTruongBienMuc from './components/CardForm';

const TruongBienMucPage = () => {
	const intl = useIntl();
	const { page, limit, deleteModel, handleEdit } = useModel('danhmuc.truongbienmuc');

	const columns: IColumn<TruongBienMuc.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'danhmuc.truongbienmuc.table.column.ma' }),
			dataIndex: 'ma',
			align: 'center',
			width: 100,
			filterType: 'string',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.truongbienmuc.table.column.noidung' }),
			dataIndex: 'noiDung',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.truongbienmuc.table.column.ghichu' }),
			dataIndex: 'ghiChu',
			width: 220,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.truongbienmuc.table.column.thaoTac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, record) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'danhmuc.truongbienmuc.table.tooltip.chinhsua' })}
						onClick={() => handleEdit(record)}
						type='link'
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => deleteModel(record._id)}
						title={intl.formatMessage({ id: 'danhmuc.truongbienmuc.table.popconfirm.xoa' })}
						placement='topRight'
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'danhmuc.truongbienmuc.table.tooltip.xoa' })}
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
			modelName='danhmuc.truongbienmuc'
			title={intl.formatMessage({ id: 'danhmuc.truongbienmuc.title' })}
			Form={CardFormTruongBienMuc}
			buttons={{ import: true, export: true }}
			widthDrawer={800}
		/>
	);
};

export default TruongBienMucPage;
