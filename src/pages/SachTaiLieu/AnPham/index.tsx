import ExpandText from '@/components/ExpandText';
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
import {
	DeleteOutlined,
	DollarOutlined,
	EditOutlined,
	EyeOutlined,
	LinkOutlined,
	MenuOutlined,
} from '@ant-design/icons';
import { Button, Card, Popconfirm, Popover, Tabs, Tag } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalBienMucTaiLieu from '../BienMuc/components/Modal';
import ModalAnPham from './components/Modal';
import StatAnPham from './components/Stat';
import ModalXepGia from './components/XepGia';

const CardAnPham = () => {
	const intl = useIntl();
	const { getModel, page, limit, handleView, setRecord, deleteModel, isView, handleEdit } =
		useModel('sachtailieu.anpham.anpham');
	const { setVisibleForm } = useModel('sachtailieu.anpham.xepgia');
	const [tabActive, setTabActive] = useState<string>('1');

	const getData = () => {
		getModel({ trangThai: ETrangThaiBienMuc.DA_BIEN_MUC, online: tabActive === '1' ? false : true });
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
			title: 'Nhan đề',
			dataIndex: 'nhanDeConverse',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Tác giả',
			dataIndex: 'tacGiaConverse',
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
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<Popover
					placement='topRight'
					content={
						<>
							<ButtonExtend tooltip='Chi tiết' onClick={() => handleView(rec)} type='link' icon={<EyeOutlined />} />
							<ButtonExtend
								tooltip='Xếp giá'
								onClick={() => {
									setRecord(rec);
									setVisibleForm(true);
								}}
								type='link'
								icon={<DollarOutlined />}
							/>
							<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
							<Popconfirm
								onConfirm={() => deleteModel(rec._id, getData)}
								title='Bạn có chắc chắn muốn xóa thông tin này?'
								placement='topRight'
							>
								<ButtonExtend tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
							</Popconfirm>
							{rec?.online && <ButtonExtend tooltip='Đường dẫn ấn phẩm số' type='link' icon={<LinkOutlined />} />}
						</>
					}
				>
					<Button type='link' icon={<MenuOutlined />} />
				</Popover>
			),
		},
	];

	return (
		<Card title={intl.formatMessage({ id: 'sachtailieu.anpham.title' })}>
			<StatAnPham />

			<Tabs onChange={(tab) => setTabActive(tab)} activeKey={tabActive}>
				<Tabs.TabPane tab='Ấn phẩm vật lý' key='1' />
				<Tabs.TabPane tab='Ấn phẩm số' key='2' />
			</Tabs>

			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, tabActive]}
				modelName='sachtailieu.anpham.anpham'
				title={intl.formatMessage({ id: 'sachtailieu.anpham.title' })}
				Form={isView ? ModalAnPham : ModalBienMucTaiLieu}
				widthDrawer={1100}
				buttons={{ create: false }}
				hideCard
			/>

			<ModalXepGia />
		</Card>
	);
};

export default CardAnPham;
