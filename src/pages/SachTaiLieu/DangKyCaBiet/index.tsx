import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import {
	colorTrangThaiDangKyCaBiet,
	ETrangThaiDangKyCaBiet,
	nameTrangThaiDangKyCaBiet,
	nameTrangThaiDangKyCaBietV2,
} from '@/services/SachTaiLieu/constant';
import dayjs from '@/utils/dayjs';
import { inputFormat } from '@/utils/utils';
import { HistoryOutlined } from '@ant-design/icons';
import { Card, Tabs, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import LichSuThueMuonPage from '../MuonTraSach/LichSu';
import FormDangKyCaBiet from './components/Form';
import StatDanhSachDKCB from './components/Stat';

const DangKyCaBietPage = () => {
	const { getSettingModel, settingMuonTra } = useModel('sachtailieu.muontra.muontra');
	const { getModel, page, limit, record, setRecord } = useModel('sachtailieu.anpham.anphamxepgia');

	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const [trangThai, setTrangThai] = useState<string>('ALL');

	useEffect(() => {
		if (!settingMuonTra) getSettingModel();
	}, []);

	const getData = () => {
		if (trangThai === 'ALL') getModel();
		else getModel({ trangThai: trangThai as any });
	};

	const onCell = (rec: AnPham.IAnPhamXepGia) => ({
		onClick: () => {
			setRecord(rec);
			setVisibleModal(true);
		},
		style: {
			cursor: 'pointer',
		},
	});

	const columns: IColumn<AnPham.IAnPhamXepGia>[] = [
		{
			title: 'Nhan đề',
			width: 180,
			render: (val, rec) => <ExpandText>{rec?.anPham?.nhanDe}</ExpandText>,
			onCell,
		},
		{
			title: 'Tác giả',
			width: 150,
			render: (val, rec) => rec?.anPham?.tacGia,
			onCell,
		},
		{
			title: 'ĐKCB',
			dataIndex: 'soDangKyCaBiet',
			align: 'center',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Thời gian xếp giá',
			dataIndex: 'thoiGianXepGia',
			align: 'center',
			width: 130,
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: 'Đơn giá',
			width: 120,
			align: 'right',
			render: (val, rec) => `${inputFormat(rec?.thongTinXepGia?.donGia ?? 0)} VNĐ`,
			onCell,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 90,
			render: (val, rec) => (
				<Tag color={colorTrangThaiDangKyCaBiet[val as ETrangThaiDangKyCaBiet]}>
					{nameTrangThaiDangKyCaBietV2[val as ETrangThaiDangKyCaBiet]}
				</Tag>
			),
			fixed: 'right',
			onCell,
			// hide: trangThai === ETrangThaiDangKyCaBiet.THANH_LY,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<ButtonExtend
					tooltip='Lịch sử đăng ký'
					onClick={() => {
						setRecord(rec);
						setVisibleModal(true);
					}}
					type='link'
					icon={<HistoryOutlined />}
				/>
			),
			// trangThai === ETrangThaiDangKyCaBiet.THANH_LY ? (
			// 	<>
			// 		{/* <Popconfirm
			// 			onConfirm={() => thanhLyDangKyCaBietModel({ _id: rec?._id, thanhLy: true }, getData)}
			// 			title='Xác nhận thanh lý đăng ký cá biệt này?'
			// 			placement='topRight'
			// 		>
			// 			<ButtonExtend tooltip='Thanh lý' type='link' icon={<ShoppingCartOutlined />} />
			// 		</Popconfirm> */}
			// 		<ButtonExtend
			// 			tooltip='Lịch sử đăng ký'
			// 			onClick={() => {
			// 				setRecord(rec);
			// 				setVisibleModal(true);
			// 			}}
			// 			type='link'
			// 			icon={<HistoryOutlined />}
			// 		/>
			// 	</>
			// ) : (
			// 	<Popconfirm
			// 		onConfirm={() => thanhLyDangKyCaBietModel({ _id: rec?._id, thanhLy: false }, getData)}
			// 		title='Xác nhận tái sử dụng đăng ký cá biệt này?'
			// 		placement='topRight'
			// 	>
			// 		<ButtonExtend tooltip='Tái sử dụng' type='link' icon={<SyncOutlined />} />
			// 	</Popconfirm>
			// ),
		},
	];

	return (
		<Card title='Danh sách đăng ký cá biệt'>
			<StatDanhSachDKCB />

			<Tabs activeKey={trangThai} onChange={(tab) => setTrangThai(tab)}>
				<Tabs.TabPane key='ALL' tab='Tất cả' />
				{Object.values(ETrangThaiDangKyCaBiet).map((tab) => (
					<Tabs.TabPane key={tab} tab={nameTrangThaiDangKyCaBiet[tab]} />
				))}
			</Tabs>

			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, trangThai]}
				modelName='sachtailieu.anpham.anphamxepgia'
				buttons={{ create: false }}
				hideCard
				Form={FormDangKyCaBiet}
				formProps={{ getData }}
				widthDrawer={800}
			/>

			<LichSuThueMuonPage
				title='Lịch sử thuê mượn'
				visible={visibleModal}
				setVisible={setVisibleModal}
				width={1100}
				condition={{ soDangKyCaBiet: record?.soDangKyCaBiet }}
			/>
		</Card>
	);
};

export default DangKyCaBietPage;
