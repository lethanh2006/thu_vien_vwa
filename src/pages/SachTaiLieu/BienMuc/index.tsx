import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import SelectCapThuMuc from '@/pages/DanhMuc/CapThuMuc/components/Select';
import SelectDangTaiLieu from '@/pages/DanhMuc/DangTaiLieu/components/Select';
import SelectKieuBanGhi from '@/pages/DanhMuc/KieuBanGhi/components/Select';
import SelectMauBienMuc from '@/pages/DanhMuc/MauBienMuc/components/Select';
import SelectVatMangTin from '@/pages/DanhMuc/VatMangTin/components/Select';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { ETrangThaiBienMuc } from '@/services/SachTaiLieu/constant';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import ModalBienMucTaiLieu from './components/Modal';

const BienMucSachTaiLieuPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('sachtailieu.anpham.anpham');

	const getData = () => {
		getModel({ trangThai: ETrangThaiBienMuc.DA_BIEN_MUC });
	};

	const columns: IColumn<AnPham.IRecord>[] = [
		{
			title: 'Kiểu bản ghi',
			dataIndex: 'kieuBanGhiId',
			width: 150,
			render: (val, rec) => rec?.kieuBanGhi?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectKieuBanGhi multiple />,
		},
		{
			title: 'Dạng tài liệu',
			dataIndex: 'dangTaiLieuId',
			width: 150,
			render: (val, rec) => rec?.dangTaiLieu?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectDangTaiLieu multiple />,
		},
		{
			title: 'Cấp thư mục',
			dataIndex: 'capThuMucId',
			width: 150,
			render: (val, rec) => rec?.capThuMuc?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectCapThuMuc multiple />,
		},
		{
			title: 'Vật mang tin',
			dataIndex: 'vatMangTinId',
			width: 150,
			render: (val, rec) => rec?.vatMangTin?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectVatMangTin multiple />,
		},
		{
			title: 'Mẫu biên mục',
			dataIndex: 'mauBienMucId',
			width: 150,
			render: (val, rec) => rec?.mauBienMuc?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectMauBienMuc multiple />,
		},
		{
			title: 'Độ mật',
			align: 'center',
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
			getData={getData}
			columns={columns}
			dependencies={[page, limit]}
			modelName='sachtailieu.anpham.anpham'
			title={intl.formatMessage({ id: 'sachtailieu.bienmuc.title' })}
			Form={ModalBienMucTaiLieu}
			widthDrawer={1000}
		/>
	);
};

export default BienMucSachTaiLieuPage;
