import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { colorTrangThaiDangKyCaBiet, ETrangThaiDangKyCaBiet } from '@/services/SachTaiLieu/constant';
import { inputFormat } from '@/utils/utils';
import { HistoryOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Card, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import LichSuThueMuonPage from '../MuonTraSach/LichSu';
import FormDangKyCaBiet from './components/Form';
import StatDanhSachDKCB from './components/Stat';
import ModalInLazer from './components/ModalInLazer';

const DangKyCaBietPage = () => {
	const { getSettingModel, settingMuonTra } = useModel('sachtailieu.muontra.muontra');
	const { page, limit, handleEdit, record, setRecord, selectedIds, setSelectedIds } = useModel(
		'sachtailieu.anpham.anphamxepgia',
	);
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const [visibleIn, setVisibleIn] = useState<boolean>(false);
	// const [activeKey, setActiveKey] = useState<string>('1');

	useEffect(() => {
		if (!settingMuonTra) getSettingModel();
	}, []);

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
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
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
			render: (val, rec) => <Tag color={colorTrangThaiDangKyCaBiet[val as ETrangThaiDangKyCaBiet]}>{val}</Tag>,
			fixed: 'right',
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						tooltip='Lịch sử đăng ký'
						onClick={() => {
							setRecord(rec);
							setVisibleModal(true);
						}}
						type='link'
						icon={<HistoryOutlined />}
					/>
					{/* <ButtonExtend
						disabled={rec?.trangThai === ETrangThaiDangKyCaBiet.BAN}
						tooltip={rec?.trangThai === ETrangThaiDangKyCaBiet.BAN ? 'Đăng ký cá biệt bận' : 'Thuê mượn'}
						onClick={() => handleEdit(rec)}
						type='link'
						icon={<PlusCircleOutlined />}
					/> */}
				</>
			),
		},
	];

	return (
		<Card title='Danh sách đăng ký cá biệt'>
			<StatDanhSachDKCB />

			<TableBase
				columns={columns}
				dependencies={[page, limit]}
				modelName='sachtailieu.anpham.anphamxepgia'
				buttons={{ create: false }}
				hideCard
				Form={FormDangKyCaBiet}
				widthDrawer={800}
				// otherProps={{
				// 	rowKey: (rec: AnPham.IAnPhamXepGia) => rec.soDangKyCaBiet,
				// 	rowSelection: {
				// 		type: 'checkbox',
				// 		selectedRowKeys: selectedIds ?? [],
				// 		onChange: (selectedRowKeys: string[]) => setSelectedIds(selectedRowKeys),
				// 		columnWidth: 40,
				// 	},
				// }}
				// otherButtons={[
				// 	// <Segmented
				// 	// 	key={'1'}
				// 	// 	value={activeKey}
				// 	// 	onChange={(value) => setActiveKey(value.toString())}
				// 	// 	options={[
				// 	// 		{ value: '1', label: 'Tất cả' },
				// 	// 		{ value: '2', label: 'Rảnh' },
				// 	// 		{ value: '3', label: 'Bận' },
				// 	// 	]}
				// 	// />,
				// 	<ButtonExtend key='print' disabled={!selectedIds?.length} onClick={() => setVisibleIn(true)}>
				// 		In ra máy in Lazer {(selectedIds?.length ?? 0) > 0 ? `(${selectedIds?.length})` : ''}
				// 	</ButtonExtend>,
				// ]}
			/>

			<LichSuThueMuonPage
				title='Lịch sử thuê mượn'
				visible={visibleModal}
				setVisible={setVisibleModal}
				width={1100}
				condition={{ soDangKyCaBiet: record?.soDangKyCaBiet }}
			/>

			<ModalInLazer visible={visibleIn} setVisible={setVisibleIn} />
		</Card>
	);
};

export default DangKyCaBietPage;
