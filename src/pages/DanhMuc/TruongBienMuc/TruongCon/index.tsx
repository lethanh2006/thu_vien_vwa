import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const DanhSachTruongCon = () => {
	const intl = useIntl();
	const { record: recTag } = useModel('danhmuc.truongbienmuc');
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('danhmuc.truongcon');

	const getData = () => {
		getModel({ tag: recTag?._id });
	};

	const columns: IColumn<TruongCon.IRecord>[] = [
		{
			title: 'Tag Code',
			dataIndex: 'tagCode',
			width: 100,
			filterType: 'string',
		},
		{
			title: 'Code',
			dataIndex: 'code',
			width: 180,
			filterType: 'string',
		},
		{
			title: 'Tiêu đề',
			dataIndex: 'tieuDe',
			width: 220,
			filterType: 'string',
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
			getData={getData}
			params={{ tag: recTag?._id }}
			columns={columns}
			dependencies={[page, limit]}
			modelName='danhmuc.truongcon'
			title={intl.formatMessage({ id: 'danhmuc.truongcon.title' })}
			Form={Form}
			buttons={{ import: true, export: true }}
			hideCard
		/>
	);
};

export default DanhSachTruongCon;
