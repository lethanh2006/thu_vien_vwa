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
			title: 'Tên giá sách',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Kho sách',
			dataIndex: 'khoSachId',
			width: 120,
			render: (val, rec) => rec?.khoSach?.ten ?? val,
			filterType: 'customselect',
			filterCustomSelect: <SelectKhoSach multiple />,
		},
		{
			title: 'Chiều dài (m)',
			dataIndex: 'chieuDai',
			align: 'center',
			width: 80,
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Chiều rộng (m)',
			dataIndex: 'chieuRong',
			align: 'center',
			width: 80,
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Phương',
			dataIndex: 'phuong',
			width: 100,
		},
		{
			title: 'Tung độ',
			dataIndex: 'tungDo',
			width: 80,
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Hoạch độ',
			dataIndex: 'hoachDo',
			width: 80,
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
					<Popconfirm
						onConfirm={() => deleteModel(rec._id)}
						title='Bạn có chắc chắn muốn xóa giá sách này?'
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
			modelName='danhmuc.giasach'
			title={intl.formatMessage({ id: 'danhmuc.giasach.title' })}
			Form={Form}
			widthDrawer={800}
		/>
	);
};

export default GiaSachPage;
