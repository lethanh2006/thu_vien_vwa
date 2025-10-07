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
import dayjs from '@/utils/dayjs';
import { CheckOutlined } from '@ant-design/icons';
import { Button, Modal, Segmented, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import GhiTraAnPham from '../components/GhiTraSach';
import RenderHanTra from '../components/RenderHanTra';
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
	const [activeKey, setActiveKey] = useState<string>('1');

	useEffect(() => {
		if (!visible) {
			setDanhSach([]);
		}
	}, [visible]);

	const getData = () => {
		const filter: any[] =
			activeKey === '2'
				? [
						{
							active: true,
							field: 'expired',
							values: [dayjs().startOf('d').toISOString(), dayjs().add(7, 'day').endOf('d').toISOString()],
							operator: EOperatorType.BETWEEN,
						},
					]
				: activeKey === '3'
					? [
							{
								active: true,
								field: 'expired',
								values: [dayjs().startOf('d').toISOString()],
								operator: EOperatorType.LESS_THAN,
							},
						]
					: activeKey === '4'
						? [{ active: true, field: 'daLaySach', values: [false], operator: EOperatorType.EQUAL }]
						: [];

		if (ssoId) {
			getModel(undefined, filter, undefined, undefined, undefined, `nguoi-muon/${ssoId}/page`);
		} else if (condition) {
			getModel(condition, filter);
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
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
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
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
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
			width: 130,
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
				dependencies={[page, limit, JSON.stringify(condition), ssoId, activeKey]}
				modelName='sachtailieu.muontra.lichsumuontra'
				Form={ChiTietLichSu}
				widthDrawer={800}
				hideCard
				buttons={{ create: false }}
				otherButtons={[
					<Segmented
						key={'1'}
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
			open={visible}
			onCancel={() => setVisible && setVisible(false)}
			width={width}
			footer={null}
			destroyOnHidden
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
