import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import { colorTrangThaiMuonSach, ETrangThaiMuonSach, EVaiTroMuonTra } from '@/services/SachTaiLieu/constant';
import type { MuonSach } from '@/services/SachTaiLieu/MuonSach/typing';
import { CheckOutlined } from '@ant-design/icons';
import { Button, Modal, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import GhiTraAnPham from '../components/GhiTraSach';
import ChiTietLichSu from './ChiTiet';

const LichSuThueMuonPage = (props: {
	visible?: boolean;
	setVisible?: (val: boolean) => void;
	title?: string;
	width?: number;
	condition?: Partial<MuonSach.IRecord>;
	ssoId?: string;
	isGhiTra?: boolean;
	hideModal?: boolean;
	getData?: () => void;
}) => {
	const intl = useIntl();
	const { visible, setVisible, title, width, condition, ssoId, isGhiTra, hideModal, getData: getDataExternal } = props;
	const { getModel, page, limit, handleView, setDanhSach } = useModel('sachtailieu.muontra.lichsumuontra');
	const { setRecord } = useModel('sachtailieu.muontra.muontra');
	const [visibleGhiTra, setVisibleGhiTra] = useState<boolean>(false);

	useEffect(() => {
		if (!visible) {
			setDanhSach([]);
		}
	}, [visible]);

	const getData = () => {
		if (ssoId) {
			getModel(undefined, undefined, undefined, undefined, undefined, `nguoi-muon/${ssoId}/page`);
		} else if (condition) {
			getModel(condition);
		}
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
			hide: !!ssoId,
		},
		{
			title: 'Mã định danh',
			dataIndex: ['phieuMuonTra', 'maDinhDanhNguoiMuon'],
			align: 'center',
			width: 120,
			render: (val, rec) => rec?.phieuMuonTra?.maDinhDanhNguoiMuon,
			onCell,
			filterType: 'string',
			hide: !!ssoId,
		},
		{
			title: 'Họ tên',
			dataIndex: ['phieuMuonTra', 'hoTenNguoiMuon'],
			width: 150,
			render: (val, rec) => rec?.phieuMuonTra?.hoTenNguoiMuon,
			onCell,
			filterType: 'string',
			hide: !!ssoId,
		},
		{
			title: 'Nhan đề',
			dataIndex: ['anPham', 'nhanDe'],
			width: 220,
			render: (val, rec) => <ExpandText>{rec?.anPham?.nhanDe}</ExpandText>,
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
			align: 'center',
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
		// {
		// 	title: 'Thời gian dự kiến mượn',
		// 	dataIndex: 'thoiGianMuonDuKien',
		// 	width: 130,
		// 	render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
		// 	filterType: 'date',
		// 	sortable: true,
		// 	onCell,
		// },
		// {
		// 	title: 'Thời gian dự kiến trả',
		// 	dataIndex: 'thoiGianTraDuKien',
		// 	width: 130,
		// 	render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
		// 	filterType: 'date',
		// 	sortable: true,
		// 	onCell,
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
		},
		// {
		// 	title: 'Trạng thái',
		// 	align: 'center',
		// 	dataIndex: 'daLaySach',
		// 	width: 120,
		// 	render: (val, rec) => (val ? <Tag color='green'>Đã lấy</Tag> : <Tag color='red'>Chưa lấy</Tag>),
		// 	onCell,
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
			width: 130,
			render: (val, rec) => <Tag color={colorTrangThaiMuonSach[val as ETrangThaiMuonSach]}>{val}</Tag>,
			filterType: 'select',
			filterData: Object.values(ETrangThaiMuonSach),
			fixed: 'right',
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
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
			),
			hide: !isGhiTra,
		},
	];

	const main = () => (
		<>
			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, JSON.stringify(condition), ssoId]}
				modelName='sachtailieu.muontra.lichsumuontra'
				Form={ChiTietLichSu}
				widthDrawer={800}
				hideCard
				buttons={{ create: false }}
			/>

			<GhiTraAnPham
				visible={visibleGhiTra}
				setVisible={setVisibleGhiTra}
				getData={() => {
					getData();
					if (getDataExternal) getDataExternal();
				}}
			/>
		</>
	);

	if (hideModal) return main();

	return (
		<Modal
			title={title}
			visible={visible}
			onCancel={() => setVisible && setVisible(false)}
			width={width}
			footer={null}
			destroyOnClose
		>
			{main()}

			<div className='form-footer'>
				<Button onClick={() => setVisible && setVisible(false)}>
					{intl.formatMessage({ id: 'global.button.dong' })}
				</Button>
			</div>
		</Modal>
	);
};

export default LichSuThueMuonPage;
