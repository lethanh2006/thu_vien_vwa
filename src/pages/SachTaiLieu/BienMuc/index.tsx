import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import type { BienMucSachTaiLieu } from '@/services/SachTaiLieu/BienMuc/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import ModalBienMucTaiLieu from './components/Modal';

const BienMucSachTaiLieuPage = () => {
	const intl = useIntl();
	const { page, limit, deleteModel, handleEdit } = useModel('sachtailieu.bienmuc');

	const columns: IColumn<BienMucSachTaiLieu.IRecord>[] = [
		{
			title: 'Độ mật',
			dataIndex: 'doMat',
			width: 90,
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Tác giả',
			dataIndex: 'tacGia',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Nhan đề chính',
			dataIndex: 'nhanDeChinh',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Tên tập',
			dataIndex: 'tenTap',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Phụ đề',
			dataIndex: 'phuDe',
			width: 120,
			filterType: 'string',
		},
		{
			title: 'Lần xuất bản',
			dataIndex: 'lanXuatBan',
			align: 'center',
			width: 100,
		},
		{
			title: 'Nơi xuất bản',
			dataIndex: 'noiXuatBan',
			width: 120,
		},
		{
			title: 'Năm xuất bản',
			dataIndex: 'namXuatBan',
			align: 'center',
			width: 120,
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Nhà xuất bản',
			dataIndex: 'nhaXuatBan',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Số trang',
			dataIndex: 'soTrang',
			align: 'center',
			width: 90,
			filterType: 'number',
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
			modelName='sachtailieu.bienmuc'
			title={intl.formatMessage({ id: 'sachtailieu.bienmuc.title' })}
			Form={ModalBienMucTaiLieu}
			widthDrawer={1000}
		/>
	);
};

export default BienMucSachTaiLieuPage;
