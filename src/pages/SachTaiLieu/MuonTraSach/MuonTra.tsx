import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import type { IColumn } from '@/components/Table/typing';
import {
	colorTrangThaiMuonSach,
	ETrangThaiMuonSach,
	EVaiTroMuonTra,
	mapNameTrangThaiMuonSach,
} from '@/services/SachTaiLieu/constant';
import type { MuonSach } from '@/services/SachTaiLieu/MuonSach/typing';
import {
	CheckOutlined,
	DeleteOutlined,
	EditOutlined,
	InfoCircleOutlined,
	MenuOutlined,
	RetweetOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Descriptions, Modal, Popconfirm, Popover, Row, Segmented, Tabs, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ChiTietAnPham from '../AnPham/components/ChiTiet';
import ChiTietMuonTraSach from './components/ChiTiet';
import FormMuonTra from './components/FormMuonTra';
import FormThoiGianMuonTra from './components/FormThoiGian';
import GhiTraAnPham from './components/GhiTraSach';
import ConfirmGiaHan from './components/ModalGiaHan';
import RenderHanTra from './components/RenderHanTra';

const MuonTraSachPage = (props: any) => {
	const { tatCaLichSu, vaiTro } = props;
	const intl = useIntl();
	const { record: recPhieu, setVisibleForm, visibleForm: visiblePhieu } = useModel('sachtailieu.muontra.phieumuontra');
	const {
		thongKeMuonTraSachModel,
		getModel,
		page,
		limit,
		handleView,
		setRecord,
		deleteModel,
		isView,
		handleEdit,
		edit,
	} = useModel('sachtailieu.muontra.muontra');
	const { visibleForm, setVisibleForm: setVisibleAnPham } = useModel('sachtailieu.anpham.anpham');
	const { getAllModel } = useModel('sachtailieu.anpham.thongtinanpham');
	const [trangThai, setTrangThai] = useState<ETrangThaiMuonSach>(ETrangThaiMuonSach.DANG_THUE_MUON);
	const [visibleGiaHan, setVisibleGiaHan] = useState<boolean>(false);
	const [visibleGhiTra, setVisibleGhiTra] = useState<boolean>(false);
	const [activeKey, setActiveKey] = useState<string>('1');

	useEffect(() => {
		setTrangThai(ETrangThaiMuonSach.DANG_THUE_MUON);
	}, [visiblePhieu]);

	let filter: any[] = [];

	if (activeKey === '2') {
		filter = [
			{
				active: true,
				field: 'expired',
				values: [moment().startOf('d').toISOString(), moment().add(7, 'day').endOf('d').toISOString()],
				operator: EOperatorType.BETWEEN,
			},
		];
	} else if (activeKey === '3') {
		filter = [
			{
				active: true,
				field: 'expired',
				values: [moment().startOf('d').toISOString()],
				operator: EOperatorType.LESS_THAN,
			},
		];
	} else if (activeKey === '4') {
		filter = [
			{
				active: true,
				field: 'daLaySach',
				values: [false],
				operator: EOperatorType.EQUAL,
			},
		];
	}

	if (vaiTro) {
		filter.push({
			active: true,
			field: ['phieuMuonTra', 'vaiTro'],
			values: [vaiTro],
			operator: EOperatorType.INCLUDE,
		});
	}

	const getData = () => {
		getModel(
			!tatCaLichSu && recPhieu?._id ? { phieuMuonTraId: recPhieu?._id, trangThai } : undefined,
			(activeKey !== '1' && trangThai === ETrangThaiMuonSach.DANG_THUE_MUON) || vaiTro ? filter : undefined,
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
			title: 'Mã định danh',
			dataIndex: ['phieuMuonTra', 'maDinhDanhNguoiMuon'],
			align: 'center',
			width: 120,
			render: (val, rec) => rec?.phieuMuonTra?.maDinhDanhNguoiMuon,
			filterType: 'string',
			onCell,
			hide: !tatCaLichSu,
		},
		{
			title: 'Họ tên',
			dataIndex: ['phieuMuonTra', 'hoTenNguoiMuon'],
			width: 180,
			render: (val, rec) => rec?.phieuMuonTra?.hoTenNguoiMuon,
			onCell,
			filterType: 'string',
			hide: !tatCaLichSu,
		},
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
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
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
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			hide: trangThai !== ETrangThaiMuonSach.DA_TRA && !tatCaLichSu,
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
			title: 'Hạn trả',
			align: 'center',
			width: 140,
			render: (_, rec) => <RenderHanTra rec={rec} />,
			onCell,
			fixed: 'right',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 120,
			render: (val, rec) => (
				<Tag color={colorTrangThaiMuonSach[val as ETrangThaiMuonSach]}>
					{mapNameTrangThaiMuonSach[val as ETrangThaiMuonSach]}
				</Tag>
			),
			filterType: 'select',
			filterData: Object.values(ETrangThaiMuonSach).map((item) => ({
				value: item,
				label: mapNameTrangThaiMuonSach[item],
			})),
			onCell,
			hide: !tatCaLichSu,
			fixed: 'right',
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						disabled={rec?.trangThai === ETrangThaiMuonSach.DA_TRA}
						tooltip='Chỉnh sửa'
						type='link'
						icon={<EditOutlined />}
						onClick={() => handleEdit(rec)}
					/>

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
												disabled={
													rec?.trangThai === ETrangThaiMuonSach.DA_TRA || moment().isBefore(moment(rec?.expired))
												}
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
				</>
			),
		},
	];

	const content = () => {
		return (
			<>
				<TableBase
					getData={getData}
					columns={columns}
					params={filter}
					dependencies={[page, limit, trangThai, activeKey, recPhieu?._id, tatCaLichSu, vaiTro]}
					modelName='sachtailieu.muontra.muontra'
					widthDrawer={edit ? 600 : 900}
					formProps={{ getData, trangThai, setTrangThai, setVisibleGhiTra }}
					Form={isView ? ChiTietMuonTraSach : FormThoiGianMuonTra}
					hideCard
					buttons={{
						create: false,
						//  export: tatCaLichSu ? true : false
					}}
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

	if (tatCaLichSu) return content();

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
									<Descriptions.Item label='Lớp hành chính'>
										{recPhieu?.tenLopHanhChinh ?? recPhieu?.tenLopHanhChinhNguoiMuon}
									</Descriptions.Item>
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

			<FormMuonTra />

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Card>
	);
};

export default MuonTraSachPage;
