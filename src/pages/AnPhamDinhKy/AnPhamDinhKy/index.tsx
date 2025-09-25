import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import SelectKyXuatBan from '@/pages/DanhMuc/KyXuatBan/components/Select';
import SelectMauBienMuc from '@/pages/DanhMuc/MauBienMuc/components/Select';
import type { AnPhamDinhKy } from '@/services/AnPhamDinhKy/typing';
import { BookOutlined, DeleteOutlined, EditOutlined, FormOutlined, MenuOutlined } from '@ant-design/icons';
import { Avatar, Popconfirm, Popover } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import ViewAnPhamDinhKy from './components/ChiTiet';
import ModalChiTietGhiNhanAnPham from './components/ChiTietGhiNhan';
import Form from './components/Form';
import ModalGhiNhanAnPhamDinhKy from './components/GhiNhan';
import StatAnPhamDinhKy from './components/Stat';

const AnPhamDinhKyPage = () => {
	const { page, limit, handleEdit, handleView, deleteModel, isView, setRecord } = useModel('anphamdinhky.anphamdinhky');
	const [visibleChiTiet, setVisibleChiTiet] = useState<boolean>(false);
	const [visibleGhiNhan, setVisibleGhiNhan] = useState<boolean>(false);

	const onCell = (rec: AnPhamDinhKy.IRecord) => ({
		onClick: () => handleView(rec),
		style: {
			cursor: 'pointer',
		},
	});

	const columns: IColumn<AnPhamDinhKy.IRecord>[] = [
		{
			title: 'Ảnh',
			dataIndex: 'anhBiaUrl',
			width: 80,
			align: 'center',
			render: (url: string, rec) => (
				<Avatar src={url} alt={rec?.ten} shape='square' style={{ width: 40, height: 40, objectFit: 'cover' }} />
			),
			onCell,
		},
		{
			title: 'Mã ấn phẩm định kỳ',
			dataIndex: 'maAnPhamDinhKy',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Tên ấn phẩm định kỳ',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Kỳ xuất bản',
			dataIndex: 'kyXuatBanId',
			width: 150,
			render: (val, rec) => rec?.kyXuatBan?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectKyXuatBan multiple />,
			onCell,
		},
		{
			title: 'Nhà xuất bản',
			dataIndex: 'nhaXuatBan',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Nơi xuất bản',
			dataIndex: 'noiXuatBan',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Năm xuất bản',
			dataIndex: 'namXuatBan',
			width: 90,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Mẫu biên mục',
			dataIndex: 'mauBienMucId',
			width: 120,
			render: (val, rec) => rec?.mauBienMuc?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectMauBienMuc multiple />,
			onCell,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Cán bộ biên mục',
			dataIndex: 'canBoBienMuc',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
					<Popover
						placement='topRight'
						content={
							<>
								<ButtonExtend
									tooltip='Ghi nhận'
									onClick={() => {
										setRecord(rec);
										setVisibleGhiNhan(true);
									}}
									type='link'
									icon={<FormOutlined />}
								/>

								<ButtonExtend
									tooltip='Chi tiết ghi nhận'
									onClick={() => {
										setRecord(rec);
										setVisibleChiTiet(true);
									}}
									type='link'
									icon={<BookOutlined />}
								/>

								<Popconfirm
									onConfirm={() => deleteModel(rec._id)}
									title='Bạn có chắc chắn muốn xóa thông tin này?'
									placement='topRight'
								>
									<ButtonExtend tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
								</Popconfirm>
							</>
						}
					>
						<ButtonExtend type='link' icon={<MenuOutlined />} />
					</Popover>
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				dependencies={[page, limit]}
				modelName='anphamdinhky.anphamdinhky'
				title='Biên mục ấn phẩm định kỳ'
				Form={isView ? ViewAnPhamDinhKy : Form}
				widthDrawer={1100}
			>
				<StatAnPhamDinhKy />
			</TableBase>

			<ModalGhiNhanAnPhamDinhKy visible={visibleGhiNhan} setVisible={setVisibleGhiNhan} />

			<ModalChiTietGhiNhanAnPham visible={visibleChiTiet} setVisible={setVisibleChiTiet} />
		</>
	);
};

export default AnPhamDinhKyPage;
