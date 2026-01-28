import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import type { GiaSach } from '@/services/DanhMuc/GiaSach/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import SelectKhoSach from '../KhoSach/components/Select';
import Form from './components/Form';

const GiaSachPage = () => {
	const intl = useIntl();
	const { page, limit, handleEdit, deleteModel } = useModel('danhmuc.giasach');

	const columns: IColumn<GiaSach.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'danhmuc.giasach.table.column.tengiasach' }),
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.giasach.table.column.khosach' }),
			dataIndex: 'maKhoSach',
			width: 120,
			render: (val, rec) => rec?.khoSach?.ten ?? val,
			filterType: 'customselect',
			filterCustomSelect: <SelectKhoSach multiple selectMa />,
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.giasach.table.column.chieudai' }),
			dataIndex: 'chieuDai',
			align: 'center',
			width: 80,
			filterType: 'number',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.giasach.table.column.chieurong' }),
			dataIndex: 'chieuRong',
			align: 'center',
			width: 80,
			filterType: 'number',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.giasach.table.column.phuong' }),
			dataIndex: 'phuong',
			width: 100,
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.giasach.table.column.tungdo' }),
			dataIndex: 'tungDo',
			width: 80,
			filterType: 'number',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.giasach.table.column.hoachdo' }),
			dataIndex: 'hoachDo',
			width: 80,
			filterType: 'number',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.giasach.table.column.thao_tac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'danhmuc.giasach.table.tooltip.chinhsua' })}
						onClick={() => handleEdit(rec)}
						type='link'
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => deleteModel(rec._id)}
						title={intl.formatMessage({ id: 'danhmuc.giasach.table.popconfirm.xoa' })}
						placement='topRight'
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'danhmuc.giasach.table.tooltip.xoa' })}
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
			modelName='danhmuc.giasach'
			title={intl.formatMessage({ id: 'danhmuc.giasach.title' })}
			Form={Form}
			widthDrawer={800}
			buttons={{ import: true, export: true }}
		/>
	);
};

export default GiaSachPage;
