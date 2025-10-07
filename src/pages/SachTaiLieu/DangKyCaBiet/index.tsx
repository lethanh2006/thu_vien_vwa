import ExpandText from '@/components/ExpandText';
import PrintBarcode from '@/components/PrintTemplate/Barcode';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { colorTrangThaiDangKyCaBiet, type ETrangThaiDangKyCaBiet } from '@/services/SachTaiLieu/constant';
import dayjs from '@/utils/dayjs';
import { inputFormat } from '@/utils/utils';
import { HistoryOutlined, SyncOutlined } from '@ant-design/icons';
import { Card, Popconfirm, Tag } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import LichSuThueMuonPage from '../MuonTraSach/LichSu';
import FormDangKyCaBiet from './components/Form';
import StatDanhSachDKCB from './components/Stat';

const DangKyCaBietPage = () => {
	const { getSettingModel, settingMuonTra } = useModel('sachtailieu.muontra.muontra');
	const { getModel, page, limit, record, setRecord, selectedIds, setSelectedIds, thanhLyDangKyCaBietModel } = useModel(
		'sachtailieu.anpham.anphamxepgia',
	);

	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const [tabActive, setTabActive] = useState<string>('1');
	// const [visibleIn, setVisibleIn] = useState<boolean>(false);
	// const [activeKey, setActiveKey] = useState<string>('1');

	const componentRef = useRef(null);

	const reactToPrintContent = useCallback(() => componentRef.current, [componentRef.current]);

	const reactToPrintTrigger = useCallback(
		() => (
			<ButtonExtend key='print' disabled={!selectedIds?.length}>
				In Barcode {(selectedIds?.length ?? 0) > 0 ? `(${selectedIds?.length})` : ''}
			</ButtonExtend>
		),
		[selectedIds?.length],
	);

	useEffect(() => {
		if (!settingMuonTra) getSettingModel();
	}, []);

	const getData = () => {
		getModel(
			undefined,
			// 	 [
			// 	{ active: true, field: 'thanhLy', values: [tabActive === '1' ? false : true], operator: EOperatorType.EQUAL },
			// ]
		);
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
			render: (val, rec) => <Tag color={colorTrangThaiDangKyCaBiet[val as ETrangThaiDangKyCaBiet]}>{val}</Tag>,
			fixed: 'right',
			onCell,
			hide: tabActive === '2',
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) =>
				tabActive === '1' ? (
					<>
						{/* <Popconfirm
							onConfirm={() => thanhLyDangKyCaBietModel({ _id: rec?._id, thanhLy: true }, getData)}
							title='Xác nhận thanh lý đăng ký cá biệt này?'
							placement='topRight'
						>
							<ButtonExtend tooltip='Thanh lý' type='link' icon={<ShoppingCartOutlined />} />
						</Popconfirm> */}
						<ButtonExtend
							tooltip='Lịch sử đăng ký'
							onClick={() => {
								setRecord(rec);
								setVisibleModal(true);
							}}
							type='link'
							icon={<HistoryOutlined />}
						/>
					</>
				) : (
					<Popconfirm
						onConfirm={() => thanhLyDangKyCaBietModel({ _id: rec?._id, thanhLy: false }, getData)}
						title='Xác nhận tái sử dụng đăng ký cá biệt này?'
						placement='topRight'
					>
						<ButtonExtend tooltip='Tái sử dụng' type='link' icon={<SyncOutlined />} />
					</Popconfirm>
				),
		},
	];

	return (
		<Card title='Danh sách đăng ký cá biệt'>
			<StatDanhSachDKCB />

			{/* <Tabs onChange={(tab) => setTabActive(tab)} activeKey={tabActive}>
				<Tabs.TabPane tab='Khả dụng' key='1' />
				<Tabs.TabPane tab='Đã thanh ký' key='2' />
			</Tabs> */}

			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, tabActive]}
				modelName='sachtailieu.anpham.anphamxepgia'
				buttons={{ create: false }}
				hideCard
				Form={FormDangKyCaBiet}
				formProps={{ getData }}
				widthDrawer={800}
				// otherProps={{
				// 	rowKey: (rec: AnPham.IAnPhamXepGia) => rec.soDangKyCaBiet,
				// 	rowSelection: {
				// 		type: 'checkbox',
				// 		selectedRowKeys: selectedIds ?? [],
				// 		onChange: (selectedRowKeys: any[]) => setSelectedIds(selectedRowKeys),
				// 		columnWidth: 40,
				// 	},
				// }}
				// otherButtons={[
				// 	tabActive === '1' ? (
				// 		<ReactToPrint
				// 			key={'prin'}
				// 			content={reactToPrintContent}
				// 			documentTitle='In'
				// 			trigger={reactToPrintTrigger}
				// 			removeAfterPrint
				// 		/>
				// 	) : (
				// 		<></>
				// 	),
				// ]}
			/>

			<LichSuThueMuonPage
				title='Lịch sử thuê mượn'
				visible={visibleModal}
				setVisible={setVisibleModal}
				width={1100}
				condition={{ soDangKyCaBiet: record?.soDangKyCaBiet }}
			/>

			<PrintBarcode ref={componentRef} listBarcodes={selectedIds?.map((item) => item) ?? []} />
		</Card>
	);
};

export default DangKyCaBietPage;
