import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import { ETrangThaiMuonSach } from '@/services/SachTaiLieu/constant';
import type { MuonSach } from '@/services/SachTaiLieu/MuonSach/typing';
import { DeleteOutlined, EditOutlined, SettingOutlined } from '@ant-design/icons';
import { Card, Popconfirm, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import CauHinhThoiHanMuonTra from './components/CauHinh';
import Form from './components/Form';

const MuonTraSachPage = () => {
	const { getModel, page, limit, handleView, handleEdit, deleteModel, getSettingModel } =
		useModel('sachtailieu.muontra.muontra');
	const [trangThai, setTrangThai] = useState<ETrangThaiMuonSach>(ETrangThaiMuonSach.CHO_XU_LY);
	const [visibleCauHinh, setVisibleCauHinh] = useState<boolean>(false);

	useEffect(() => {
		getSettingModel();
	}, []);

	const getData = () => {
		getModel({ trangThai });
	};

	const onCell = (rec: MuonSach.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<MuonSach.IRecord>[] = [
		{
			title: 'Mã SV',
			dataIndex: 'maDinhDanhNguoiMuon',
			width: 180,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Họ tên',
			dataIndex: 'hotenNguoiMuon',
			width: 180,
			filterType: 'string',
			onCell,
		},
		{
			title: 'ĐKCB',
			dataIndex: 'soDangKyCaBiet',
			width: 180,
			filterType: 'string',
			onCell,
		},
		// {
		// 	title: 'Tên sách',
		// 	dataIndex: 'tenSach',
		// 	width: 180,
		// 	filterType: 'string',
		// 	onCell,
		// },
		{
			title: 'Ngày mượn',
			dataIndex: 'thoiGianMuon',
			width: 180,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Hạn trả',
			dataIndex: 'thoiGianTra',
			width: 180,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 180,
			filterType: 'string',
			onCell,
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
		<Card
			title='Danh sách sinh viên mượn sách'
			extra={
				<ButtonExtend
					tooltip='Cấu hình'
					onClick={() => setVisibleCauHinh(true)}
					icon={<SettingOutlined />}
					type='link'
				/>
			}
		>
			<Tabs activeKey={trangThai} onChange={(tab) => setTrangThai(tab as ETrangThaiMuonSach)}>
				{Object.values(ETrangThaiMuonSach).map((tab) => (
					<Tabs.TabPane key={tab} tab={tab} />
				))}
			</Tabs>

			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, trangThai]}
				modelName='sachtailieu.muontra.muontra'
				widthDrawer={800}
				formProps={{ getData }}
				Form={Form}
				hideCard
			/>

			<CauHinhThoiHanMuonTra visible={visibleCauHinh} setVisible={setVisibleCauHinh} />
		</Card>
	);
};

export default MuonTraSachPage;
