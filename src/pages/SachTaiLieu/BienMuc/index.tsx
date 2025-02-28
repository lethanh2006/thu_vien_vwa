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
import { DeleteOutlined, EditOutlined, EyeOutlined, MenuOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Checkbox, Popconfirm, Popover, Tag } from 'antd';
import { useIntl, useModel } from 'umi';
import ModalBienMucTaiLieu from './components/Modal';

const BienMucSachTaiLieuPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, handleEdit, handleView, setRecord, setEdit, setIsView, setVisibleForm, deleteModel } =
		useModel('sachtailieu.anpham.anpham');

	const getData = () => {
		getModel({ trangThai: ETrangThaiBienMuc.CHO_BIEN_MUC });
	};

	const onCell = (rec: AnPham.IRecord) => ({
		onClick: () => handleView(rec),
		style: {
			cursor: 'pointer',
		},
	});

	const columns: IColumn<AnPham.IRecord>[] = [
		{
			title: 'Mã tài liệu',
			dataIndex: 'maTaiLieu',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Tác giả',
			dataIndex: 'tacGia',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Nhan đề chính',
			dataIndex: 'nhanDe',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Kiểu bản ghi',
			dataIndex: 'kieuBanGhiId',
			width: 150,
			render: (val, rec) => rec?.kieuBanGhi?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectKieuBanGhi multiple />,
			onCell,
		},
		{
			title: 'Dạng tài liệu',
			dataIndex: 'dangTaiLieuId',
			width: 150,
			render: (val, rec) => rec?.dangTaiLieu?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectDangTaiLieu multiple />,
			onCell,
		},
		{
			title: 'Cấp thư mục',
			dataIndex: 'capThuMucId',
			width: 150,
			render: (val, rec) => rec?.capThuMuc?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectCapThuMuc multiple />,
			onCell,
		},
		{
			title: 'Vật mang tin',
			dataIndex: 'vatMangTinId',
			width: 150,
			render: (val, rec) => rec?.vatMangTin?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectVatMangTin multiple />,
			onCell,
		},
		{
			title: 'Mẫu biên mục',
			dataIndex: 'mauBienMucId',
			width: 150,
			render: (val, rec) => rec?.mauBienMuc?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectMauBienMuc multiple />,
			onCell,
		},
		{
			title: 'Độ mật',
			align: 'center',
			dataIndex: 'doMat',
			width: 90,
			filterType: 'number',
			sortable: true,
			onCell,
		},
		{
			title: 'Ấn phẩm số',
			align: 'center',
			dataIndex: 'online',
			width: 100,
			render: (val, rec) => <Checkbox checked={val} />,
			onCell,
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
			onCell,
			fixed: 'right',
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<Popover
					placement='topRight'
					content={
						<>
							<ButtonExtend tooltip='Chi tiết' onClick={() => handleView(rec)} type='link' icon={<EyeOutlined />} />
							<ButtonExtend
								tooltip='Biên mục chi tiết'
								onClick={() => handleEdit(rec)}
								type='link'
								icon={<EditOutlined />}
							/>

							<Popconfirm
								onConfirm={() => deleteModel(rec._id, getData)}
								title='Bạn có chắc chắn muốn xóa thông tin này?'
								placement='topRight'
							>
								<ButtonExtend tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
							</Popconfirm>
						</>
					}
				>
					<Button type='link' icon={<MenuOutlined />} />
				</Popover>
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
			buttons={{ create: false }}
			otherButtons={[
				<ButtonExtend
					key={'1'}
					onClick={() => {
						setRecord({} as AnPham.IRecord);
						setEdit(false);
						setIsView(false);
						setVisibleForm(true);
					}}
					icon={<PlusCircleOutlined />}
					type='primary'
					notHideText
					tooltip='Biên mục sơ lược'
				>
					Biên mục sơ lược
				</ButtonExtend>,
			]}
		/>
	);
};

export default BienMucSachTaiLieuPage;
