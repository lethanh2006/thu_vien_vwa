import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';
import SelectPhongDoc from '../PhongDoc/components/Select';

const KhoSachPage = () => {
	const intl = useIntl();
	const { page, limit, handleEdit, deleteModel } = useModel('danhmuc.khosach');

	const columns: IColumn<KhoSach.IRecord>[] = [
		{
			title: 'Mã kho',
			dataIndex: 'ma',
			width: 100,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Tên kho',
			dataIndex: 'ten',
			width: 220,
			filterType: 'string',
		},
		{
			title: 'Phòng đọc',
			dataIndex: 'maPhongDoc',
			width: 180,
			render: (val, rec) => rec?.phongDoc?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectPhongDoc multiple selectMa />,
		},
		// {
		// 	title: 'Số ĐKCB cuối',
		// 	dataIndex: 'soLuongAnPhamDaXepGia',
		// 	width: 80,
		// 	filterType: 'number',
		// 	sortable: true,
		// },
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
						title='Bạn có chắc chắn muốn xóa kho sách này?'
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
			modelName='danhmuc.khosach'
			title={intl.formatMessage({ id: 'danhmuc.khosach.title' })}
			Form={Form}
			buttons={{ import: true, export: true }}
		/>
	);
};

export default KhoSachPage;
