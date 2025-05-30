import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import type { IColumn } from '@/components/Table/typing';
import { colorTrangThaiMuonSach, ETrangThaiMuonSach, EVaiTroMuonTra } from '@/services/SachTaiLieu/constant';
import type { MuonSach } from '@/services/SachTaiLieu/MuonSach/typing';
import {
	CheckOutlined,
	DeleteOutlined,
	ImportOutlined,
	InfoCircleOutlined,
	MenuOutlined,
	PlusCircleOutlined,
	RetweetOutlined,
} from '@ant-design/icons';
import { Button, Modal, Popconfirm, Popover, Segmented, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { history, useIntl, useModel } from 'umi';
import ChiTietAnPham from '../AnPham/components/ChiTiet';
import ChiTietMuonTraSach from '../MuonTraSach/components/ChiTiet';
import GhiTraAnPham from '../MuonTraSach/components/GhiTraSach';
import ConfirmGiaHan from '../MuonTraSach/components/ModalGiaHan';
import FormGhiTra from './components/Form';
import ModalImport from '@/components/Table/Import';

const GhiTraPage = () => {
	const intl = useIntl();
	const { ngoaiThoiGian } = useModel('sachtailieu.muontra.phieumuontra');
	const {
		thongKeMuonTraSachModel,
		getModel,
		page,
		limit,
		handleView,
		setRecord,
		deleteModel,
		isView,
		setEdit,
		setIsView,
		setVisibleForm,
	} = useModel('sachtailieu.muontra.muontra');
	const { visibleForm, setVisibleForm: setVisibleAnPham } = useModel('sachtailieu.anpham.anpham');
	const { getAllModel } = useModel('sachtailieu.anpham.thongtinanpham');
	const [visibleGiaHan, setVisibleGiaHan] = useState<boolean>(false);
	const [visibleGhiTra, setVisibleGhiTra] = useState<boolean>(false);
	const [activeKey, setActiveKey] = useState<string>('1');
	const [visibleImport, setVisibleImport] = useState(false);

	// useEffect(() => {
	// 	if (ngoaiThoiGian) {
	// 		Modal.info({
	// 			bodyStyle: { padding: 0 },
	// 			icon: null,
	// 			okButtonProps: { hidden: true },
	// 			content: (
	// 				<>
	// 					<div style={{ marginTop: -8 }}>
	// 						<img style={{ width: '100%' }} src='/logi-thong-bao.png' alt={'image'} />
	// 					</div>
	// 					<div style={{ padding: '20px 16px' }}>
	// 						<div style={{ color: '#1890ff', fontSize: 20, fontWeight: 600, textAlign: 'center' }}>
	// 							⏰ Thời gian mượn – trả sách: 08:00 - 17:00 hằng ngày 📚
	// 						</div>
	// 					</div>
	// 					<div className='form-footer'>
	// 						<Button
	// 							type={'primary'}
	// 							onClick={() => {
	// 								Modal.destroyAll();
	// 								history.push('/');
	// 							}}
	// 						>
	// 							Đóng
	// 						</Button>
	// 					</div>
	// 				</>
	// 			),
	// 		});
	// 	}
	// }, [ngoaiThoiGian]);

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

		getModel(undefined, activeKey !== '1' ? filter : undefined);
	};

	const onCell = (rec: MuonSach.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<MuonSach.IRecord>[] = [
		{
			title: 'Vai trò',
			dataIndex: ['phieuMuonTra', 'vaiTro'],
			align: 'center',
			width: 90,
			render: (val, rec) => rec?.phieuMuonTra?.vaiTro,
			onCell,
			filterType: 'select',
			filterData: Object.values(EVaiTroMuonTra),
		},
		{
			title: 'Mã định danh',
			dataIndex: ['phieuMuonTra', 'maDinhDanhNguoiMuon'],
			align: 'center',
			width: 120,
			render: (val, rec) => rec?.phieuMuonTra?.maDinhDanhNguoiMuon,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Họ tên',
			dataIndex: ['phieuMuonTra', 'hoTenNguoiMuon'],
			width: 180,
			render: (val, rec) => rec?.phieuMuonTra?.hoTenNguoiMuon,
			onCell,
			filterType: 'string',
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
			onCell,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 220,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		{
			title: 'Ghi chú trả',
			dataIndex: 'ghiChuTra',
			width: 220,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 120,
			render: (val, rec) => <Tag color={colorTrangThaiMuonSach[val as ETrangThaiMuonSach]}>{val}</Tag>,
			filterType: 'select',
			filterData: Object.values(ETrangThaiMuonSach),
			onCell,
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
						onClick={() => {
							setRecord(rec);
							setVisibleGhiTra(true);
						}}
						tooltip='Ghi trả'
						className='text-success'
						type='link'
						icon={<CheckOutlined />}
					/>
					<Popover
						placement='topRight'
						content={
							<>
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

	return (
		<>
			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, activeKey]}
				modelName='sachtailieu.muontra.muontra'
				widthDrawer={isView ? 1000 : 'full'}
				formProps={{ getData, setVisibleGhiTra }}
				Form={isView ? ChiTietMuonTraSach : FormGhiTra}
				title='Ghi trả sách'
				buttons={{ create: false }}
				otherButtons={[
					<ButtonExtend
						key={'1'}
						onClick={() => {
							setRecord({} as MuonSach.IRecord);
							setEdit(false);
							setIsView(false);
							setVisibleForm(true);
						}}
						icon={<PlusCircleOutlined />}
						type='primary'
						notHideText
						tooltip='Ghi trả'
					>
						Ghi trả
					</ButtonExtend>,

					<ButtonExtend key={'import'} icon={<ImportOutlined />} onClick={() => setVisibleImport(true)}>
						Nhập dữ liệu
					</ButtonExtend>,

					<Segmented
						key={'2'}
						value={activeKey}
						onChange={(value) => setActiveKey(value.toString())}
						options={[
							{ value: '1', label: 'Tất cả' },
							{ value: '2', label: 'Sắp đến hạn' },
							{ value: '3', label: 'Quá hạn' },
						]}
					/>,
				]}
			/>

			<Modal
				title='Chi tiết ấn phẩm'
				visible={visibleForm}
				onCancel={() => setVisibleAnPham(false)}
				width={900}
				footer={
					<div className='form-footer'>
						<Button onClick={() => setVisibleAnPham(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
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

			<ModalImport
				visible={visibleImport}
				modelName='sachtailieu.muontra.phieumuontra'
				onCancel={() => setVisibleImport(false)}
				titleTemplate={'Biểu mẫu phiếu mượn.xlsx'}
				onOk={() => getModel()}
			/>
		</>
	);
};

export default GhiTraPage;
