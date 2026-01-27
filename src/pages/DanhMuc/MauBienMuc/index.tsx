import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { CopyOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import ModalMauBienMuc from './components/Modal';

const BieuMauPhuLucPage = () => {
	const intl = useIntl();
	const { page, limit, handleEdit, deleteModel, getModel, saoChepMauBienMucModel } = useModel('danhmuc.maubienmuc');

	const columns: IColumn<MauBienMuc.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'danhmuc.maubienmuc.table.column.ma' }),
			dataIndex: 'ma',
			width: 100,
			filterType: 'string',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.maubienmuc.table.column.tenbieumau' }),
			dataIndex: 'ten',
			width: 220,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.maubienmuc.table.column.thaoTac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<Popconfirm
						onConfirm={() => saoChepMauBienMucModel(rec._id, getModel)}
						title={intl.formatMessage({ id: 'danhmuc.maubienmuc.table.popconfirm.saochep' })}
						placement='topRight'
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'danhmuc.maubienmuc.table.tooltip.saochep' })}
							type='link'
							icon={<CopyOutlined />}
						/>
					</Popconfirm>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'danhmuc.maubienmuc.table.tooltip.chinhsua' })}
						onClick={() => handleEdit(rec)}
						type='link'
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => deleteModel(rec._id)}
						title={intl.formatMessage({ id: 'danhmuc.maubienmuc.table.popconfirm.xoa' })}
						placement='topRight'
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'danhmuc.maubienmuc.table.tooltip.xoa' })}
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
			modelName='danhmuc.maubienmuc'
			title={intl.formatMessage({ id: 'danhmuc.maubienmuc.title' })}
			Form={ModalMauBienMuc}
			widthDrawer={800}
		/>
	);
};

export default BieuMauPhuLucPage;
