import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';

const ThuocTinhAnPham = () => {
	const intl = useIntl();
	const { record: recThongTinAnPham } = useModel('sachtailieu.anpham.thongtinanpham');
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('sachtailieu.anpham.thuoctinhanpham');

	const getData = () => {
		if (recThongTinAnPham?._id) {
			getModel({ thongTinAnPhamId: recThongTinAnPham?._id });
		}
	};

	const columns: IColumn<AnPham.IThuocTinhAnPham>[] = [
		{
			title: 'Trường con',
			dataIndex: 'code',
			width: 150,
			render: (val, rec) => rec?.thongTinCode?.tagCode ?? val,
		},
		{
			title: 'Value',
			dataIndex: 'value',
			width: 150,
			render: (val, rec) => val ?? 'Không có thông tin',
			filterType: 'string',
			sortable: true,
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
			dependencies={[page, limit, recThongTinAnPham?._id]}
			modelName='sachtailieu.anpham.thuoctinhanpham'
			title={intl.formatMessage({ id: 'sachtailieu.anpham.thuoctinhanpham.title' })}
			// Form={CardFormThongTinAnPham}
			formProps={{ getData }}
			hideCard
		/>
	);
};

export default ThuocTinhAnPham;
