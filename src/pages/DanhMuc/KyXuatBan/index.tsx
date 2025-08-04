import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import moment from 'moment';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const KyXuatBanPage = () => {
	const intl = useIntl();
	const { page, limit, deleteModel, handleEdit } = useModel('danhmuc.kyxuatban');

	const columns: IColumn<KyXuatBan.IRecord>[] = [
		{
			title: 'Tên',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			width: 180,
			filterType: 'string',
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Bắt đầu',
			dataIndex: 'thoiGianBatDau',
			align: 'center',
			width: 100,
			filterType: 'date',
			sortable: true,
			render: (val) => val && moment(val).format('DD/MM/YYYY'),
		},
		{
			title: 'Kết thúc',
			dataIndex: 'thoiGianKetThuc',
			align: 'center',
			width: 100,
			filterType: 'date',
			sortable: true,
			render: (val) => val && moment(val).format('DD/MM/YYYY'),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, record) => (
				<>
					<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					<Popconfirm
						onConfirm={() => deleteModel(record._id)}
						title='Bạn có chắc chắn muốn xóa thông tin này?'
						placement='topRight'
					>
						<ButtonExtend tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
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
