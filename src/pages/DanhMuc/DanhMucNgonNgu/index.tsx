import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const DanhMucNgonNgu = () => {
	const intl = useIntl();
	const { page, limit, handleEdit, deleteModel } = useModel('danhmuc.danhmucngonngu');

	const columns: IColumn<DanhMucNgonNgu.IRecord>[] = [
		{
			title: 'Mã ngôn ngữ',
			dataIndex: 'ma',
			width: 100,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Tên ngôn ngữ',
			dataIndex: 'ten',
			width: 220,
			filterType: 'string',
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
						title='Bạn có chắc chắn muốn xóa ngôn ngữ này?'
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
			modelName='danhmuc.danhmucngonngu'
			title={intl.formatMessage({ id: 'danhmuc.danhmucngonngu.title' })}
			Form={Form}
			buttons={{ import: true, export: true }}
		/>
	);
};

export default DanhMucNgonNgu;
