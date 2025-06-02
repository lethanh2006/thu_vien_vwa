import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import type { IColumn } from '@/components/Table/typing';
import { ETrangThaiMuonSach, EVaiTroMuonTra, mapNameTrangThaiMuonSach } from '@/services/SachTaiLieu/constant';
import type { MuonSach } from '@/services/SachTaiLieu/MuonSach/typing';
import { CheckOutlined, DeleteOutlined, InfoCircleOutlined, MenuOutlined, RetweetOutlined } from '@ant-design/icons';
import { Button, Card, Col, Descriptions, Modal, Popconfirm, Popover, Row, Segmented, Tabs, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ChiTietAnPham from '../AnPham/components/ChiTiet';
import ChiTietMuonTraSach from './components/ChiTiet';
import GhiTraAnPham from './components/GhiTraSach';
import ConfirmGiaHan from './components/ModalGiaHan';

const MuonTraSachPage = () => {
	const intl = useIntl();
	const { record: recPhieu, setVisibleForm, visibleForm: visiblePhieu } = useModel('sachtailieu.muontra.phieumuontra');
	const { thongKeMuonTraSachModel, getModel, page, limit, handleView, setRecord, deleteModel } =
		useModel('sachtailieu.muontra.muontra');
	const { visibleForm, setVisibleForm: setVisibleAnPham } = useModel('sachtailieu.anpham.anpham');
	const { getAllModel } = useModel('sachtailieu.anpham.thongtinanpham');
	const [trangThai, setTrangThai] = useState<ETrangThaiMuonSach>(ETrangThaiMuonSach.DANG_THUE_MUON);
	const [visibleGiaHan, setVisibleGiaHan] = useState<boolean>(false);
	const [visibleGhiTra, setVisibleGhiTra] = useState<boolean>(false);
	const [activeKey, setActiveKey] = useState<string>('1');

	useEffect(() => {
		setTrangThai(ETrangThaiMuonSach.DANG_THUE_MUON);
	}, [visiblePhieu]);

	const getData = () => {
		const filter: any[] =
			activeKey === '2'
				? [
						{
							active: true,
							field: 'expired',
							values: [moment().toISOString(), moment().add(7, 'day').toISOString()],
							operator: EOperatorType.BETWEEN,
						},
				  ]
				: activeKey === '3'
				? [{ active: true, field: 'expired', values: [moment().toISOString()], operator: EOperatorType.LESS_THAN }]
				: activeKey === '4'
				? [{ active: true, field: 'daLaySach', values: [false], operator: EOperatorType.EQUAL }]
				: [];

		getModel(
			{ phieuMuonTraId: recPhieu?._id, trangThai },
			activeKey !== '1' && trangThai === ETrangThaiMuonSach.DANG_THUE_MUON ? filter : undefined,
		);
	};

	// const handleLaySach = (rec: MuonSach.IRecord) => {
	// 	putModel(rec?._id, { daLaySach: true }, getData)
	// 		.then()
	// 		.catch((err) => console.log(err));
	// };

	const onCell = (rec: MuonSach.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<MuonSach.IRecord>[] = [
		{
			title: 'Nhan đề',
			dataIndex: ['anPham', 'nhanDe'],
			width: 220,
			render: (val, rec) => (
				<ExpandText>
					<ButtonExtend
						size='small'
						type='link'
						icon={<InfoCircleOutlined />}
						onClick={(e) => {
							e.stopPropagation();
							getAllModel(undefined, undefined, { anPhamId: rec?.anPhamId });
							setVisibleAnPham(true);
						}}
					/>
					{rec?.anPham?.nhanDe}
				</ExpandText>
			),
			filterType: 'string',
			onCell,
		},
		{
			title: 'Tác giả',
			dataIndex: ['anPham', 'tacGia'],
			width: 180,
			render: (val, rec) => rec?.anPham?.tacGia,
			filterType: 'string',
			onCell,
		},
		{
			title: 'ĐKCB',
			dataIndex: 'soDangKyCaBiet',
			width: 120,
			filterType: 'string',
			onCell,
			// hide: trangThai === ETrangThaiMuonSach.CHO_XU_LY,
		},
		{
			title: 'Thời gian mượn',
			dataIndex: 'thoiGianMuon',
			align: 'center',
			width: 150,
			render: (val, rec) => {
				if (!val) return null;
				const formattedTime = moment(val).startOf('day').format('DD/MM/YYYY');
				const expirationTime = rec?.expired ? moment(rec.expired).startOf('day') : moment().startOf('day');
				const now = moment().startOf('day');
				const isOverdue = now.isAfter(expirationTime);
				const isApproachingDeadline = !isOverdue && expirationTime.diff(now, 'days') <= 7;
				const color = isOverdue ? 'red' : isApproachingDeadline ? 'orange' : 'inherit';
				const fontWeight = isOverdue || isApproachingDeadline ? 600 : 'normal';
				return <span style={{ color, fontWeight }}>{formattedTime}</span>;
			},
			filterType: 'date',
			sortable: true,
			onCell,
			// hide: trangThai === ETrangThaiMuonSach.CHO_XU_LY,
		},
		// {
		// 	title: 'Thời gian dự kiến mượn',
		// 	dataIndex: 'thoiGianMuonDuKien',
		// 	width: 130,
		// 	render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
		// 	filterType: 'date',
		// 	sortable: true,
		// 	onCell,
		// 	hide: trangThai !== ETrangThaiMuonSach.CHO_XU_LY,
		// },
		// {
		// 	title: 'Thời gian dự kiến trả',
		// 	dataIndex: 'thoiGianTraDuKien',
		// 	width: 130,
		// 	render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
		// 	filterType: 'date',
		// 	sortable: true,
		// 	onCell,
		// 	hide: trangThai !== ETrangThaiMuonSach.CHO_XU_LY,
		// },
		{
			title: 'Hạn trả',
			align: 'center',
			dataIndex: 'expired',
			width: 130,
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
			// hide: trangThai === ETrangThaiMuonSach.CHO_XU_LY,
		},
		// {
		// 	title: 'Trạng thái',
		// 	align: 'center',
		// 	dataIndex: 'daLaySach',
		// 	width: 120,
		// 	render: (val, rec) => (val ? <Tag color='green'>Đã lấy</Tag> : <Tag color='red'>Chưa lấy</Tag>),
		// 	onCell,
		// 	// hide: trangThai === ETrangThaiMuonSach.CHO_XU_LY,
		// },
		// {
		// 	title: 'Thời gian gia hạn',
		// 	align: 'center',
		// 	dataIndex: 'thoiGianGiaHan',
		// 	width: 130,
		// 	render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
		// 	filterType: 'date',
		// 	sortable: true,
		// 	onCell,
		// 	// hide: trangThai === ETrangThaiMuonSach.CHO_XU_LY,
		// },
		{
			title: 'Thời gian trả',
			dataIndex: 'thoiGianTra',
			width: 150,
			render: (val, rec) => {
				if (!val) return null;
				const formattedTime = moment(val).startOf('day').format('DD/MM/YYYY');
				const expirationTime = rec?.expired ? moment(rec.expired).startOf('day') : moment().startOf('day');
				const isOverdue = moment().startOf('day').isAfter(expirationTime);
				return (
					<span style={{ color: isOverdue ? 'red' : 'inherit', fontWeight: isOverdue ? 600 : 0 }}>{formattedTime}</span>
				);
			},
			filterType: 'date',
			sortable: true,
			hide: trangThai !== ETrangThaiMuonSach.DA_TRA,
			onCell,
		},
		// {
		// 	title: 'Ghi chú đăng ký',
		// 	dataIndex: 'ghiChuDangKy',
		// 	width: 220,
		// 	render: (val, rec) => <ExpandText>{val}</ExpandText>,
		// 	onCell,
		// },
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 220,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			onCell,
			// hide: trangThai === ETrangThaiMuonSach.CHO_XU_LY,
		},
		{
			title: 'Ghi chú trả',
			dataIndex: 'ghiChuTra',
			width: 220,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			onCell,
			hide: trangThai !== ETrangThaiMuonSach.DA_TRA,
		},
		{
			title: 'Tình trạng hạn trả',
			align: 'center',
			width: 140,
			render: (_, rec) => {
				// Trường hợp không có thông tin hạn trả
				if (!rec?.expired) {
					return <span>-</span>;
				}

				// Xác định các thời điểm quan trọng
				const hanTra = moment(rec.expired).startOf('day');
				const ngayTra = rec?.thoiGianTra ? moment(rec.thoiGianTra).startOf('day') : null;
				const now = moment().startOf('day');

				// 1. Trường hợp đã trả sách
				if (rec.trangThai === ETrangThaiMuonSach.DA_TRA && ngayTra) {
					const soNgayQuaHan = ngayTra.diff(hanTra, 'days');

					if (soNgayQuaHan > 0) {
						return <Tag color='red'>Đã trả muộn {soNgayQuaHan} ngày</Tag>;
					} else {
						return <Tag color='green'>Đã trả đúng hạn</Tag>;
					}
				}
				// 2. Trường hợp đang mượn
				else if (rec.trangThai === ETrangThaiMuonSach.DANG_THUE_MUON) {
					const soNgayQuaHan = now.diff(hanTra, 'days');
					const soNgayConLai = hanTra.diff(now, 'days');

					if (soNgayQuaHan > 0) {
						return <Tag color='red'>Quá hạn {soNgayQuaHan} ngày</Tag>;
					} else if (soNgayConLai <= 7) {
						return <Tag color='orange'>Sắp đến hạn</Tag>;
					} else {
						return <Tag color='green'>Còn {soNgayConLai} ngày</Tag>;
					}
				}
				// 3. Các trạng thái khác
				return <span>-</span>;
			},
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
							{
								// trangThai === ETrangThaiMuonSach.CHO_XU_LY ? (
								// 	<ButtonExtend
								// 		tooltip='Duyệt'
								// 		type='link'
								// 		icon={<CheckOutlined />}
								// 		className='text-success'
								// 		onClick={() => handleView(rec)}
								// 	/>
								// ) :
								trangThai === ETrangThaiMuonSach.DANG_THUE_MUON ? (
									<>
										<ButtonExtend
											disabled={rec?.trangThai === ETrangThaiMuonSach.DA_TRA}
											onClick={() => {
												setRecord(rec);
												setVisibleGhiTra(true);
											}}
											tooltip='Ghi trả'
											className='text-success'
											type='link'
											icon={<CheckOutlined />}
										/>
										{/* <Popconfirm
											onConfirm={() => handleLaySach(rec)}
											title='Bạn có chắc chắn sinh viên đã lấy đầu sách này?'
											placement='topRight'
										>
											<ButtonExtend
												disabled={rec?.daLaySach}
												tooltip='Xác nhận sinh viên lấy sách'
												type='link'
												icon={<UserOutlined />}
											/>
										</Popconfirm> */}
										<ButtonExtend
											tooltip='Gia hạn'
											type='link'
											icon={<RetweetOutlined />}
											onClick={() => {
												setRecord(rec);
												setVisibleGiaHan(true);
											}}
											disabled={rec?.trangThai === ETrangThaiMuonSach.DA_TRA || moment().isBefore(moment(rec?.expired))}
										/>
									</>
								) : null
							}

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
					<ButtonExtend type='link' icon={<MenuOutlined />} />
				</Popover>
			),
		},
	];

	const content = () => {
		return (
			<>
				<TableBase
					getData={getData}
					columns={columns}
					dependencies={[page, limit, trangThai, activeKey, recPhieu?._id]}
					modelName='sachtailieu.muontra.muontra'
					widthDrawer={900}
					formProps={{ getData, trangThai, setTrangThai, setVisibleGhiTra }}
					Form={ChiTietMuonTraSach}
					hideCard
					buttons={{ create: false }}
					otherButtons={[
						trangThai === ETrangThaiMuonSach.DANG_THUE_MUON ? (
							<Segmented
								key={'1'}
								value={activeKey}
								onChange={(value) => setActiveKey(value.toString())}
								options={[
									{ value: '1', label: 'Tất cả' },
									{ value: '2', label: 'Sắp đến hạn' },
									{ value: '3', label: 'Quá hạn' },
									// { value: '4', label: 'Chưa lấy sách' },
								]}
							/>
						) : (
							<></>
						),
					]}
				/>

				<Modal
					title='Chi tiết ấn phẩm'
					visible={visibleForm}
					onCancel={() => setVisibleAnPham(false)}
					width={900}
					footer={
						<div className='form-footer'>
							<Button onClick={() => setVisibleAnPham(false)}>
								{intl.formatMessage({ id: 'global.button.dong' })}
							</Button>
						</div>
					}
				>
					<ChiTietAnPham />
				</Modal>

				<ConfirmGiaHan
					visible={visibleGiaHan}
					setVisible={setVisibleGiaHan}
					getData={() => {
						thongKeMuonTraSachModel();
						getData();
					}}
				/>

				<GhiTraAnPham
					visible={visibleGhiTra}
					setVisible={setVisibleGhiTra}
					getData={() => {
						thongKeMuonTraSachModel();
						getData();
					}}
				/>
			</>
		);
	};

	return (
		<Card title='Chi tiết phiếu mượn'>
			<Row gutter={[12, 0]}>
				<Col span={24}>
					<Col xs={24}>
						<Descriptions
							column={{ xs: 1, sm: 1, md: 2 }}
							bordered
							style={{ marginBottom: 18 }}
							title='Thông tin người mượn'
						>
							<Descriptions.Item label='Vai trò'>{recPhieu?.vaiTro ?? '--'}</Descriptions.Item>
							<Descriptions.Item label={recPhieu?.vaiTro === EVaiTroMuonTra.SINHVIEN ? 'Mã sinh viên' : 'Mã cán bộ'}>
								{recPhieu?.maDinhDanhNguoiMuon ?? '--'}
							</Descriptions.Item>
							<Descriptions.Item label='Họ tên'>{recPhieu?.hoTenNguoiMuon ?? '--'}</Descriptions.Item>
							<Descriptions.Item label='Ngày sinh'>{recPhieu?.ngaySinhNguoiMuon ?? '--'}</Descriptions.Item>
							<Descriptions.Item label='Thời gian đăng ký'>
								{recPhieu?.thoiGianDangKy ? moment(recPhieu?.thoiGianDangKy).format('DD/MM/YYYY') : '--'}
							</Descriptions.Item>

							{recPhieu?.vaiTro === EVaiTroMuonTra.SINHVIEN ? (
								<>
									<Descriptions.Item label='Khóa sinh viên'>
										{recPhieu?.tenKhoaSinhVienNguoiMuon ?? '--'}
									</Descriptions.Item>
									<Descriptions.Item label='Khóa ngành'>{recPhieu?.tenNganhNguoiMuon ?? '--'}</Descriptions.Item>
								</>
							) : (
								<>
									<Descriptions.Item label='Đơn vị'>{recPhieu?.tenDonViNguoiMuon ?? '--'}</Descriptions.Item>
								</>
							)}
						</Descriptions>
					</Col>
				</Col>
			</Row>

			<Tabs activeKey={trangThai} onChange={(tab) => setTrangThai(tab as ETrangThaiMuonSach)}>
				{Object.values(ETrangThaiMuonSach).map((tab) => (
					<Tabs.TabPane key={tab} tab={mapNameTrangThaiMuonSach[tab]} />
				))}
			</Tabs>

			{content()}

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Card>
	);
};

export default MuonTraSachPage;
