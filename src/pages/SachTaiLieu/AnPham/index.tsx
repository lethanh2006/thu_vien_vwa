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
import { DollarOutlined, EyeOutlined } from '@ant-design/icons';
import { Card, Tag } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalAnPham from './components/Modal';
import StatAnPham from './components/Stat';
import ModalXepGia from './components/XepGia';

const CardAnPham = () => {
	const intl = useIntl();
	const { getModel, page, limit, handleView, setRecord } = useModel('sachtailieu.anpham.anpham');
	const [visibleXepGia, setVisibleXepGia] = useState<boolean>(false);

	const getData = () => {
		getModel({ trangThai: ETrangThaiBienMuc.DA_BIEN_MUC });
	};

	const onCell = (rec: AnPham.IRecord) => ({
		onClick: () => handleView(rec),
		style: {
			cursor: 'pointer',
		},
	});

	const columns: IColumn<AnPham.IRecord>[] = [
		// {
		// 	title: 'Mã tài liệu',
		// 	dataIndex: 'maTaiLieu',
		// 	width: 120,
		// 	render: (val, rec) => val ?? 'Không có thông tin',
		// 	filterType: 'string',
		// 	onCell,
		// },
		{
			title: 'Nhan đề',
			dataIndex: 'nhanDe',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
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
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend tooltip='Chi tiết' onClick={() => handleView(rec)} type='link' icon={<EyeOutlined />} />
					<ButtonExtend
						tooltip='Xếp giá'
						onClick={() => {
							setRecord(rec);
							setVisibleXepGia(true);
						}}
						type='link'
						icon={<DollarOutlined />}
					/>
				</>
			),
		},
	];

	return (
		<Card title={intl.formatMessage({ id: 'sachtailieu.anpham.title' })}>
			<StatAnPham />

			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit]}
				modelName='sachtailieu.anpham.anpham'
				title={intl.formatMessage({ id: 'sachtailieu.anpham.title' })}
				Form={ModalAnPham}
				widthDrawer={1100}
				buttons={{ create: false }}
				hideCard
			/>

			<ModalXepGia visibleForm={visibleXepGia} setVisibleForm={setVisibleXepGia} />
		</Card>
	);
};

export default CardAnPham;
