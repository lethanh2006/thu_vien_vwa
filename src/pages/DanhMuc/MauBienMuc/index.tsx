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
			title: 'Mã',
			dataIndex: 'ma',
			width: 100,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Tên biểu mẫu',
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
					<Popconfirm
						onConfirm={() => saoChepMauBienMucModel(rec._id, getModel)}
						title='Bạn có chắc chắn muốn sao chép mẫu biên mục này?'
						placement='topRight'
					>
						<ButtonExtend tooltip='Sao chép' type='link' icon={<CopyOutlined />} />
					</Popconfirm>
					<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
					<Popconfirm
						onConfirm={() => deleteModel(rec._id)}
						title='Bạn có chắc chắn muốn xóa biểu mẫu này?'
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
			modelName='danhmuc.maubienmuc'
			title={intl.formatMessage({ id: 'danhmuc.maubienmuc.title' })}
			Form={ModalMauBienMuc}
			widthDrawer={800}
		/>
	);
};

export default BieuMauPhuLucPage;
