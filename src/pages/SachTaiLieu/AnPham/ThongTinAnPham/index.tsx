import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import SelectTruongBienMuc from '@/pages/DanhMuc/TruongBienMuc/components/Select';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import CardFormThongTinAnPham from './components/CardForm';

const ThongTinAnPham = () => {
	const intl = useIntl();
	const { record: recAnPham } = useModel('sachtailieu.anpham.anpham');
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('sachtailieu.anpham.thongtinanpham');

	const getData = () => {
		if (recAnPham?._id) {
			getModel({ anPhamId: recAnPham?._id });
		}
	};

	const columns: IColumn<AnPham.IThongTinAnPham>[] = [
		{
			title: 'Trường biên mục',
			dataIndex: 'tagCode',
			width: 150,
			render: (val, rec) => rec?.tag ?? val,
			filterType: 'customselect',
			filterCustomSelect: <SelectTruongBienMuc multiple selectMa />,
		},
		{
			title: 'Chỉ thị 1',
			dataIndex: 'ind1',
			width: 120,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Chỉ thị 2',
			dataIndex: 'ind2',
			width: 120,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Value',
			dataIndex: 'value',
			width: 150,
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
			dependencies={[page, limit, recAnPham?._id]}
			modelName='sachtailieu.anpham.thongtinanpham'
			title={intl.formatMessage({ id: 'sachtailieu.anpham.thongtinanpham.title' })}
			Form={CardFormThongTinAnPham}
			formProps={{ getData }}
			widthDrawer={800}
			hideCard
		/>
	);
};

export default ThongTinAnPham;
