import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import SelectCapThuMuc from '@/pages/DanhMuc/CapThuMuc/components/Select';
import SelectDangTaiLieu from '@/pages/DanhMuc/DangTaiLieu/components/Select';
import SelectKieuBanGhi from '@/pages/DanhMuc/KieuBanGhi/components/Select';
import SelectMauBienMuc from '@/pages/DanhMuc/MauBienMuc/components/Select';
import SelectVatMangTin from '@/pages/DanhMuc/VatMangTin/components/Select';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { colorTrangThaiBienMuc, ETrangThaiBienMuc } from '@/services/SachTaiLieu/constant';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import { useIntl, useModel } from 'umi';
import ModalBienMucTaiLieu from './components/Modal';

const BienMucSachTaiLieuPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, handleEdit, handleView } = useModel('sachtailieu.anpham.anpham');

	const getData = () => {
		getModel({ trangThai: ETrangThaiBienMuc.CHO_BIEN_MUC });
	};

	const columns: IColumn<AnPham.IRecord>[] = [
		{
			title: 'Tác giả',
			dataIndex: 'tacGia',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Nhan đề chính',
			dataIndex: 'nhanDe',
			width: 150,
			filterType: 'string',
		},
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
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 120,
			render: (val, rec) => (
				<Tag
					style={{ whiteSpace: 'normal', wordWrap: 'break-word', textAlign: 'center' }}
					color={colorTrangThaiBienMuc[val as ETrangThaiBienMuc]}
				>
					{val}
				</Tag>
			),
			fixed: 'right',
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend tooltip='Chi tiết' onClick={() => handleView(rec)} type='link' icon={<EyeOutlined />} />
					<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
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
			formProps={{ getData }}
			widthDrawer={1000}
		/>
	);
};

export default BienMucSachTaiLieuPage;
