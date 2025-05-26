import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';
import { EOperatorType } from '@/components/Table/constant';

const DanhSachTruongCon = () => {
	const intl = useIntl();
	const { record: recTag } = useModel('danhmuc.truongbienmuc');
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('danhmuc.truongcon');

	const getData = () => {
		if (recTag?._id)
			getModel(undefined, [
				{
					active: true,
					field: 'tag',
					values: [recTag?.ma],
					operator: EOperatorType.INCLUDE,
				},
			]);
	};

	const columns: IColumn<TruongCon.IRecord>[] = [
		{
			title: 'Code',
			dataIndex: 'code',
			width: 180,
			filterType: 'string',
		},
		{
			title: 'Tag Code',
			dataIndex: 'tagCode',
			width: 100,
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
						onConfirm={() => deleteModel(record._id, getData)}
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
			columns={columns}
			dependencies={[page, limit, recTag?._id]}
			modelName='danhmuc.truongcon'
			title={intl.formatMessage({ id: 'danhmuc.truongcon.title' })}
			Form={Form}
			formProps={{ getData }}
			buttons={{ import: true, export: true }}
			hideCard
		/>
	);
};

export default DanhSachTruongCon;
