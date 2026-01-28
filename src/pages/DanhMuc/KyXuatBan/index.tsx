import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import dayjs from '@/utils/dayjs';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const KyXuatBanPage = () => {
	const intl = useIntl();
	const { page, limit, deleteModel, handleEdit } = useModel('danhmuc.kyxuatban');

	const columns: IColumn<KyXuatBan.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'danhmuc.kyxuatban.table.column.ten' }),
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.kyxuatban.table.column.mota' }),
			dataIndex: 'moTa',
			width: 180,
			filterType: 'string',
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.kyxuatban.table.column.batdau' }),
			dataIndex: 'thoiGianBatDau',
			align: 'center',
			width: 100,
			filterType: 'date',
			sortable: true,
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.kyxuatban.table.column.ketthuc' }),
			dataIndex: 'thoiGianKetThuc',
			align: 'center',
			width: 100,
			filterType: 'date',
			sortable: true,
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.kyxuatban.table.column.thaoTac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, record) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'danhmuc.kyxuatban.table.tooltip.chinhsua' })}
						onClick={() => handleEdit(record)}
						type='link'
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => deleteModel(record._id)}
						title={intl.formatMessage({ id: 'danhmuc.kyxuatban.table.popconfirm.xoa' })}
						placement='topRight'
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'danhmuc.kyxuatban.table.tooltip.xoa' })}
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
			modelName='danhmuc.kyxuatban'
			title={intl.formatMessage({ id: 'danhmuc.kieuxuatban.title' })}
			Form={Form}
			buttons={{ import: true, export: true }}
		/>
	);
};

export default KyXuatBanPage;
