import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import type { IColumn } from '@/components/Table/typing';
import { ETrangThaiDuyeMuonSach, ETrangThaiMuonSach, mapNameTrangThaiMuonSach } from '@/services/SachTaiLieu/constant';
import type { MuonSach } from '@/services/SachTaiLieu/MuonSach/typing';
import {
	CheckOutlined,
	DeleteOutlined,
	EditOutlined,
	InfoCircleOutlined,
	MenuOutlined,
	RetweetOutlined,
	SettingOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { Button, Card, Modal, Popconfirm, Popover, Segmented, Tabs, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ChiTietAnPham from '../AnPham/components/ChiTiet';
import CauHinhThoiHanMuonTra from './components/CauHinh';
import ChiTietMuonTraSach from './components/ChiTiet';
import Form from './components/Form';
import GhiTraAnPham from './components/GhiTraSach';
import ConfirmGiaHan from './components/ModalGiaHan';
import StatMuonTraSach from './components/Stat';

const MuonTraSachPage = () => {
	const {
		getModel,
		page,
		limit,
		handleView,
		handleEdit,
		deleteModel,
		getSettingModel,
		settingMuonTra,
		isView,
		setRecord,
		putModel,
		thongKeMuonTraSachModel,
	} = useModel('sachtailieu.muontra.muontra');
	const { handleView: handleViewAnPham, visibleForm, setVisibleForm } = useModel('sachtailieu.anpham.anpham');
	const [trangThai, setTrangThai] = useState<ETrangThaiMuonSach>(ETrangThaiMuonSach.CHO_XU_LY);
	const [visibleCauHinh, setVisibleCauHinh] = useState<boolean>(false);
	const [visibleGiaHan, setVisibleGiaHan] = useState<boolean>(false);
	const [visibleGhiTra, setVisibleGhiTra] = useState<boolean>(false);
	const [activeKey, setActiveKey] = useState<string>('1');

	useEffect(() => {
		if (!settingMuonTra) getSettingModel();
	}, []);

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
			trangThai === ETrangThaiMuonSach.CHO_XU_LY ? { trangThaiDuyet: ETrangThaiDuyeMuonSach.CHO_DUYET } : { trangThai },
			activeKey !== '1' && trangThai === ETrangThaiMuonSach.DANG_THUE_MUON ? filter : undefined,
		);
	};

	const handleLaySach = (rec: MuonSach.IRecord) => {
		putModel(rec?._id, { daLaySach: true }, getData)
			.then()
			.catch((err) => console.log(err));
	};

	const onCell = (rec: MuonSach.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<MuonSach.IRecord>[] = [
		{
			title: 'Mã SV',
			dataIndex: 'maDinhDanhNguoiMuon',
			align: 'center',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Họ tên',
			dataIndex: 'hotenNguoiMuon',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Nhan đề',
			width: 220,
			render: (val, rec) => (
				<ExpandText>
					<ButtonExtend
						size='small'
						type='link'
						icon={<InfoCircleOutlined />}
						onClick={(e) => {
							e.stopPropagation();
							handleViewAnPham(rec?.anPham);
						}}
					/>
					{rec?.anPham?.nhanDe}
				</ExpandText>
			),
			onCell,
		},
		{
			title: 'Tác giả',
			width: 180,
			render: (val, rec) => rec?.anPham?.tacGia,
			onCell,
		},
		{
			title: 'ĐKCB',
			dataIndex: 'soDangKyCaBiet',
			width: 90,
			filterType: 'string',
			onCell,
			hide: trangThai === ETrangThaiMuonSach.CHO_XU_LY,
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
			hide: trangThai === ETrangThaiMuonSach.CHO_XU_LY,
		},
		{
			title: 'Thời gian dự kiến mượn',
			dataIndex: 'thoiGianMuonDuKien',
			width: 130,
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
			hide: trangThai !== ETrangThaiMuonSach.CHO_XU_LY,
		},
		{
			title: 'Thời gian dự kiến trả',
			dataIndex: 'thoiGianTraDuKien',
			width: 130,
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
			hide: trangThai !== ETrangThaiMuonSach.CHO_XU_LY,
		},
		{
			title: 'Hạn trả',
			align: 'center',
			dataIndex: 'expired',
			width: 130,
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
			hide: trangThai === ETrangThaiMuonSach.CHO_XU_LY,
		},
		{
			title: 'Trạng thái',
			align: 'center',
			dataIndex: 'daLaySach',
			width: 120,
			render: (val, rec) => (val ? <Tag color='green'>Đã lấy</Tag> : <Tag color='red'>Chưa lấy</Tag>),
			onCell,
			hide: trangThai === ETrangThaiMuonSach.CHO_XU_LY,
		},
		{
			title: 'Thời gian gia hạn',
			align: 'center',
			dataIndex: 'thoiGianGiaHan',
			width: 130,
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
			hide: trangThai === ETrangThaiMuonSach.CHO_XU_LY,
		},
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

		{
			title: 'Ghi chú đăng ký',
			dataIndex: 'ghiChuDangKy',
			width: 220,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 220,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			onCell,
			hide: trangThai === ETrangThaiMuonSach.CHO_XU_LY,
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
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, record) => (
				<Popover
					placement='topRight'
					content={
						<>
							{trangThai === ETrangThaiMuonSach.CHO_XU_LY ? (
								<ButtonExtend
									tooltip='Duyệt'
									type='link'
									icon={<CheckOutlined />}
									className='text-success'
									onClick={() => handleView(record)}
								/>
							) : trangThai === ETrangThaiMuonSach.DANG_THUE_MUON ? (
								<>
									<ButtonExtend
										onClick={() => {
											setRecord(record);
											setVisibleGhiTra(true);
										}}
										tooltip='Ghi trả'
										className='text-success'
										type='link'
										icon={<CheckOutlined />}
									/>

									<Popconfirm
										onConfirm={() => handleLaySach(record)}
										title='Bạn có chắc chắn sinh viên đã lấy đầu sách này?'
										placement='topRight'
									>
										<ButtonExtend
											disabled={record?.daLaySach}
											tooltip='Xác nhận sinh viên lấy sách'
											type='link'
											icon={<UserOutlined />}
										/>
									</Popconfirm>

									<ButtonExtend
										tooltip='Gia hạn'
										type='link'
										icon={<RetweetOutlined />}
										onClick={() => {
											setRecord(record);
											setVisibleGiaHan(true);
										}}
										disabled={moment().isBefore(moment(record?.expired))}
									/>
								</>
							) : null}

							<ButtonExtend
								disabled={record?.trangThai === ETrangThaiMuonSach.DA_TRA}
								tooltip='Chỉnh sửa'
								onClick={() => handleEdit(record)}
								type='link'
								icon={<EditOutlined />}
							/>
							<Popconfirm
								onConfirm={() => deleteModel(record._id, getData)}
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
			<div style={{ marginBottom: 12 }}>
				<StatMuonTraSach setTrangThai={setTrangThai} setActiveKey={setActiveKey} />
			</div>

			<Tabs activeKey={trangThai} onChange={(tab) => setTrangThai(tab as ETrangThaiMuonSach)}>
				{Object.values(ETrangThaiMuonSach).map((tab) => (
					<Tabs.TabPane key={tab} tab={mapNameTrangThaiMuonSach[tab]} />
				))}
			</Tabs>

			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, trangThai, activeKey]}
				modelName='sachtailieu.muontra.muontra'
				widthDrawer={900}
				formProps={{ getData, trangThai, setTrangThai, setVisibleGhiTra }}
				Form={isView ? ChiTietMuonTraSach : Form}
				hideCard
				otherButtons={
					trangThai === ETrangThaiMuonSach.DANG_THUE_MUON
						? [
								<Segmented
									key={'1'}
									value={activeKey}
									onChange={(value) => setActiveKey(value.toString())}
									options={[
										{ value: '1', label: 'Tất cả' },
										{ value: '2', label: 'Sắp đến hạn' },
										{ value: '3', label: 'Quá hạn' },
										{ value: '4', label: 'Chưa lấy sách' },
									]}
								/>,
						  ]
						: []
				}
			/>

			<CauHinhThoiHanMuonTra visible={visibleCauHinh} setVisible={setVisibleCauHinh} />

			<Modal
				title='Chi tiết ấn phẩm'
				visible={visibleForm}
				onCancel={() => setVisibleForm(false)}
				width={900}
				footer={null}
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
		</Card>
	);
};

export default MuonTraSachPage;
